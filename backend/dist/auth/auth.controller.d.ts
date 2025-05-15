import { AuthService } from './auth.service';
import { loginDTO } from './dto/login.dto';
import { signupDTO } from './dto/signup.dto';
import { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDTO: loginDTO): Promise<{
        status: number;
        message: string;
        content: string;
    }>;
    signup(signupDTO: signupDTO, res: Response): Promise<void>;
    verify(body: {
        email: string;
        code: string;
    }, res: Response): Promise<void>;
    forgotPassword(email: string, res: Response): Promise<void>;
    verifyForgotPasswordCode(email: string, verificationCode: string, res: Response): Promise<void>;
    resetPassword(email: string, res: Response, newPassword: string): Promise<void>;
}
