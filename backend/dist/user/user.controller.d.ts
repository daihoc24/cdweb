import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { getData } from './interface';
interface UpdatePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getListUser(res: Response): Promise<void>;
    getUserInfor(userId: number, res: Response): Promise<void>;
    creatUser(CreateUserDto: CreateUserDto, req: getData, res: Response): Promise<void>;
    updatePassword(updatePasswordDto: UpdatePasswordDto, userId: number, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    updateUser(userId: string, body: UpdateUserDto, req: getData, res: Response): Promise<void>;
    deleteUser(userId: number, req: getData): Promise<{
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
    searchUserByName(res: Response, name: string): Promise<void>;
}
export {};
