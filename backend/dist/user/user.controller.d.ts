import { UserService } from './user.service';
import { Response } from 'express';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getListUser(res: Response): Promise<void>;
    getUserInfor(userId: number, res: Response): Promise<void>;
}
