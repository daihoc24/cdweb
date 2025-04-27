import { PrismaClient } from '@prisma/client';
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
}
