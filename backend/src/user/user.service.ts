import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';
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
}
