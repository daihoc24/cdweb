import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  prisma = new PrismaClient();


  // Thông tin chọn lọc cho người dùng
  selectInfoUser = {
    user_fullname: true,
    user_email: true,
    user_phone: true,
    user_birthDate: true,
    user_role: true,
    user_address: true
  };

  // Lấy danh sách người dùng
  async getListUser() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          user_id: true,
          user_fullname: true,
          user_email: true,
          user_password: true,
          user_phone: true,
          user_birthDate: true,
          user_role: true,
          user_address: true
        },
      });
      return { users };
    } catch (err) {
      throw new Error(`Error getting users: ${err}`);
    }
  }

  // Lấy thông tin của người dùng theo id (user_id)
  async getUserInfor(userId: number) {
    try {
      const data = await this.prisma.user.findUnique({
        select: this.selectInfoUser,
        where: {
          user_id: userId,
        },
      });
      return { data };
    } catch (error) {
      throw new Error(`Error fetching user info: ${error}`);
    }
  }
  // Tạo người dùng mới
  async createUser(body: CreateUserDto) {
    const { ...userData } = body;
    const passBcrypt: string = await bcrypt.hash(userData.user_password, 10);
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

    // Tạo mới User
    const createdUser = await this.prisma.user.create({
      data: {
        ...userData,
        user_password: passBcrypt,
        is_verified: true,
      },
    });
    return createdUser;
  }

  // Cập nhật thông tin người dùng
  async updateUser(userId: number, body: UpdateUserDto) {
    const { ...userData } = body;
    if (userData.user_password) {
      const hashedPassword = await bcrypt.hash(userData.user_password, 10);
      const updatedUser = await this.prisma.user.update({
        where: { user_id: userId },
        data: {
          ...userData,
          user_password: hashedPassword
        },
      });
      return updatedUser;
    }
    const updatedUser = await this.prisma.user.update({
      where: { user_id: userId },
      data: {
        ...userData,
      },
    });
    return updatedUser;
  }
}
