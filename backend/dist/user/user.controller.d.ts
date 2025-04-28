import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';
import { getData } from './interface';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getListUser(res: Response): Promise<void>;
    getUserInfor(userId: number, res: Response): Promise<void>;
    creatUser(CreateUserDto: CreateUserDto, req: getData, res: Response): Promise<void>;
}
