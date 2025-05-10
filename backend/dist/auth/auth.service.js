"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    jwtService;
    configService;
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
    }
    prisma = new client_1.PrismaClient();
    async login(body) {
        const { user_email, user_password } = body;
        try {
            const user = await this.prisma.user.findFirst({
                where: {
                    user_email,
                },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('Email hoặc mật khẩu không chính xác');
            }
            if (!user.is_verified) {
                throw new common_1.UnauthorizedException('Tài khoản chưa được xác thực. Vui lòng kiểm tra email.');
            }
            const passCompare = await bcrypt.compare(user_password, user.user_password);
            if (!passCompare) {
                throw new common_1.UnauthorizedException('Email hoặc mật khẩu không chính xác');
            }
            const token = this.jwtService.sign({ data: { id: user.user_id, user_email } }, {
                expiresIn: this.configService.get('EXPIRES_IN'),
                secret: this.configService.get('SECRET_KEY'),
            });
            return {
                status: 200,
                message: 'Đăng nhập thành công',
                content: token,
            };
        }
        catch (err) {
            throw new common_1.UnauthorizedException('Đăng nhập không thành công');
        }
    }
    async signup(body) {
        const { ...userData } = body;
        const passBcrypt = await bcrypt.hash(userData.user_password, 10);
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
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const createdUser = await this.prisma.user.create({
            data: {
                ...userData,
                user_password: passBcrypt,
                user_role: 'user',
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
            from: 'hoangquy4874@gmail.com',
            to: userData.user_email,
            subject: 'Xác thực tài khoản của bạn',
            text: `Cảm ơn bạn đã đăng ký. Mã xác thực của bạn là: ${verificationCode}`,
        };
        try {
            await transporter.sendMail(mailOptions);
            return {
                message: 'Đăng ký thành công. Vui lòng kiểm tra email để lấy mã xác thực.',
                createdUser,
            };
        }
        catch (error) {
            console.error('Error sending email:', error);
            return {
                status: 500,
                message: 'Đăng ký thành công nhưng không thể gửi email xác thực. Vui lòng thử lại.',
                createdUser,
            };
        }
    }
    async verifyAccount(email, code) {
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
        }
        else {
            return {
                status: 400,
                message: 'Mã xác thực không chính xác.',
            };
        }
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findFirst({
            where: { user_email: email },
        });
        if (!user) {
            return {
                status: 404,
                message: 'Email không tồn tại.',
            };
        }
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
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
        }
        catch (error) {
            console.error('Lỗi khi gửi email:', error);
            return {
                status: 500,
                message: 'Không thể gửi email xác thực. Vui lòng thử lại sau.',
            };
        }
    }
    async verifyForgotPasswordCode(email, verificationCode) {
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
        }
        else {
            return {
                status: 400,
                message: 'Mã xác thực không chính xác.',
            };
        }
    }
    async resetPassword(email, newPassword) {
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map