"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
let UserService = class UserService {
    prisma = new client_1.PrismaClient();
    selectInfoUser = {
        user_fullname: true,
        user_email: true,
        user_phone: true,
        user_birthDate: true,
        user_role: true,
        user_address: true
    };
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
        }
        catch (err) {
            throw new Error(`Error getting users: ${err}`);
        }
    }
    async getUserInfor(userId) {
        try {
            const data = await this.prisma.user.findUnique({
                select: this.selectInfoUser,
                where: {
                    user_id: userId,
                },
            });
            return { data };
        }
        catch (error) {
            throw new Error(`Error fetching user info: ${error}`);
        }
    }
    async createUser(body) {
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
        const createdUser = await this.prisma.user.create({
            data: {
                ...userData,
                user_password: passBcrypt,
                is_verified: true,
            },
        });
        return createdUser;
    }
    async updateUser(userId, body) {
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
    async updatePassword(userId, body) {
        const { currentPassword, newPassword } = body;
        const user = await this.prisma.user.findUnique({
            where: { user_id: userId },
        });
        if (!user) {
            throw new Error('User not found');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await this.prisma.user.update({
            where: { user_id: userId },
            data: {
                user_password: hashedPassword,
            },
        });
        return updatedUser;
    }
    async deleteUser(userId) {
        try {
            const data = await this.prisma.user.delete({
                where: {
                    user_id: userId,
                },
            });
            return { data };
        }
        catch (err) {
            throw new Error(`Error deleting user: ${err}`);
        }
    }
    async searchUserByName(name) {
        try {
            const data = await this.prisma.user.findMany({
                where: {
                    user_fullname: {
                        contains: name,
                    },
                },
            });
            return { data };
        }
        catch { }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)()
], UserService);
//# sourceMappingURL=user.service.js.map