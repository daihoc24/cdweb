import { loginDTO } from './dto/login.dto';
import { signupDTO } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
export declare class AuthService {
    private jwtService;
    private configService;
    constructor(jwtService: JwtService, configService: ConfigService);
    prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
    login(body: loginDTO): Promise<{
        status: number;
        message: string;
        content: string;
    }>;
    signup(body: signupDTO): Promise<{
        status: number;
        message: string;
        createdUser?: undefined;
    } | {
        message: string;
        createdUser: {
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
        status?: undefined;
    } | {
        status: number;
        message: string;
        createdUser: {
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
    verifyAccount(email: string, code: string): Promise<{
        status: number;
        message: string;
    } | {
        message: string;
        status?: undefined;
    }>;
    forgotPassword(email: string): Promise<{
        status: number;
        message: string;
    } | {
        message: string;
        status?: undefined;
    }>;
    verifyForgotPasswordCode(email: string, verificationCode: string): Promise<{
        status: number;
        message: string;
    } | {
        message: string;
        status?: undefined;
    }>;
    resetPassword(email: string, newPassword: string): Promise<{
        status: number;
        message: string;
    } | {
        message: string;
        status?: undefined;
    }>;
}
