import { Injectable, UnauthorizedException } from '@nestjs/common';
import { loginDTO } from './dto/login.dto';
import { signupDTO } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  prisma = new PrismaClient();

  async login(body: loginDTO) {
    const { user_email, user_password } = body;
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          user_email,
        },
      });
      if (!user) {
        throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
      }
      if (!user.is_verified) {
        throw new UnauthorizedException(
          'Tài khoản chưa được xác thực. Vui lòng kiểm tra email.',
        );
      }

      const passCompare = await bcrypt.compare(
        user_password,
        user.user_password!,
      );

      if (!passCompare) {
        throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
      }
      const token = this.jwtService.sign(
        { data: { id: user.user_id, user_email } },
        {
          expiresIn: this.configService.get('EXPIRES_IN'),
          secret: this.configService.get('SECRET_KEY'),
        },
      );
      return {
        status: 200,
        message: 'Đăng nhập thành công',
        content: token,
      };
    } catch (err) {
      throw new UnauthorizedException('Đăng nhập không thành công');
    }
  }

  async signup(body: signupDTO) {
    const { ...userData } = body;
    const passBcrypt: string = await bcrypt.hash(userData.user_password, 10);

    // Kiểm tra email đã tồn tại
    const checkEmail = await this.prisma.user.findFirst({
      where: {
        user_email: userData.user_email,
      },
    });
    if (checkEmail) {
      return {
        status: 400,
        message: 'Email đã tồn tại.',
      };
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    // Tạo mới User
    const createdUser = await this.prisma.user.create({
      data: {
        ...userData,
        user_password: passBcrypt,
        user_role: 'user',
        verification_code: verificationCode,
        is_verified: false,
      },
    });

    // Cấu hình nodemailer
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'hoangquy4874@gmail.com',
        pass: 'rcdtoewuhabuzpsq',
      },
    });

    // Cấu hình email
    const mailOptions = {
      from: 'hoangquy4874@gmail.com',
      to: userData.user_email,
      subject: 'Xác thực tài khoản của bạn',
      text: `Cảm ơn bạn đã đăng ký. Mã xác thực của bạn là: ${verificationCode}`,
    };

    // Gửi email
    try {
      await transporter.sendMail(mailOptions);
      return {
        message:
          'Đăng ký thành công. Vui lòng kiểm tra email để lấy mã xác thực.',
        createdUser,
      };
    } catch (error) {
      console.error('Error sending email:', error);
      return {
        status: 500,
        message:
          'Đăng ký thành công nhưng không thể gửi email xác thực. Vui lòng thử lại.',
        createdUser,
      };
    }
  }
  async verifyAccount(email: string, code: string) {
    const user = await this.prisma.user.findFirst({
      where: { user_email: email },
    });

    if (!user) {
      return {
        status: 404,
        message: 'Email không tồn tại.',
      };
    }

    if (user.verification_code === code) {
      await this.prisma.user.update({
        where: { user_id: user.user_id },
        data: { is_verified: true, verification_code: null },
      });

      return {
        message: 'Xác thực thành công! Tài khoản đã được kích hoạt.',
      };
    } else {
      return {
        status: 400,
        message: 'Mã xác thực không chính xác.',
      };
    }
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { user_email: email },
    });

    if (!user) {
      return {
        status: 404,
        message: 'Email không tồn tại.',
      };
    }
    if (!user.is_verified) {
      return {
        status: 403,
        message: 'Tài khoản chưa được xác thực. Vui lòng kiểm tra email để xác thực trước.',
      };
    }
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    await this.prisma.user.update({
      where: { user_id: user.user_id },
      data: {
        verification_code: verificationCode,
        is_verified: false,
      },
    });
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'hoangquy4874@gmail.com',
        pass: 'rcdtoewuhabuzpsq',
      },
    });
    const mailOptions = {
      from: "hoangquy4874@gmail.com",
      to: email,
      subject: 'Mã xác thực đổi mật khẩu',
      text: `Bạn vừa yêu cầu đổi mật khẩu. Mã xác thực của bạn là: ${verificationCode}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      return {
        message: 'Mã xác thực đã được gửi qua email.',
      };
    } catch (error) {
      console.error('Lỗi khi gửi email:', error);
      return {
        status: 500,
        message: 'Không thể gửi email xác thực. Vui lòng thử lại sau.',
      };
    }
  }

  async verifyForgotPasswordCode(email: string, verificationCode: string) {
    const user = await this.prisma.user.findFirst({
      where: { user_email: email },
    });

    if (!user) {
      return {
        status: 404,
        message: 'Email không tồn tại.',
      };
    }

    if (user.verification_code === verificationCode) {
      await this.prisma.user.update({
        where: { user_id: user.user_id },
        data: {
          is_verified: true,
        },
      });
      return {
        message: 'Mã xác thực thành công. Bạn có thể thay đổi mật khẩu mới.',
      };
    } else {
      return {
        status: 400,
        message: 'Mã xác thực không chính xác.',
      };
    }
  }

  async resetPassword(email: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: { user_email: email },
    });

    if (!user) {
      return {
        status: 404,
        message: 'Email không tồn tại.',
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { user_id: user.user_id },
      data: {
        user_password: hashedPassword,
        verification_code: null,
      },
    });

    return {
      message: 'Mật khẩu đã được cập nhật thành công',
    };
  }
}
