import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';
interface UpdatePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export declare class UserService {
    prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
    selectInfoUser: {
        user_fullname: boolean;
        user_email: boolean;
        user_phone: boolean;
        user_birthDate: boolean;
        user_role: boolean;
        user_address: boolean;
    };
    getListUser(): Promise<{
        users: {
            user_fullname: string | null;
            user_email: string | null;
            user_password: string | null;
            user_phone: string | null;
            user_birthDate: Date | null;
            user_role: string | null;
            user_address: string | null;
            user_id: number;
        }[];
    }>;
    getUserInfor(userId: number): Promise<{
        data: {
            user_fullname: string | null;
            user_email: string | null;
            user_phone: string | null;
            user_birthDate: Date | null;
            user_role: string | null;
            user_address: string | null;
        } | null;
    }>;
    createUser(body: CreateUserDto): Promise<{
        user_fullname: string | null;
        user_email: string | null;
        user_password: string | null;
        user_phone: string | null;
        user_birthDate: Date | null;
        user_role: string | null;
        user_address: string | null;
        user_id: number;
        verification_code: string | null;
        is_verified: boolean | null;
    } | {
        status: number;
        message: string;
    }>;
    updateUser(userId: number, body: UpdateUserDto): Promise<{
        user_fullname: string | null;
        user_email: string | null;
        user_password: string | null;
        user_phone: string | null;
        user_birthDate: Date | null;
        user_role: string | null;
        user_address: string | null;
        user_id: number;
        verification_code: string | null;
        is_verified: boolean | null;
    }>;
    updatePassword(userId: number, body: UpdatePasswordDto): Promise<{
        user_fullname: string | null;
        user_email: string | null;
        user_password: string | null;
        user_phone: string | null;
        user_birthDate: Date | null;
        user_role: string | null;
        user_address: string | null;
        user_id: number;
        verification_code: string | null;
        is_verified: boolean | null;
    }>;
    deleteUser(userId: number): Promise<{
        data: {
            user_fullname: string | null;
            user_email: string | null;
            user_password: string | null;
            user_phone: string | null;
            user_birthDate: Date | null;
            user_role: string | null;
            user_address: string | null;
            user_id: number;
            verification_code: string | null;
            is_verified: boolean | null;
        };
    }>;
    searchUserByName(name: string): Promise<{
        data: {
            user_fullname: string | null;
            user_email: string | null;
            user_password: string | null;
            user_phone: string | null;
            user_birthDate: Date | null;
            user_role: string | null;
            user_address: string | null;
            user_id: number;
            verification_code: string | null;
            is_verified: boolean | null;
        }[];
    } | undefined>;
}
export {};
