import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDTO } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { signupDTO } from './dto/signup.dto';
import { Response } from 'express';

@ApiTags('Auth')
@Controller('/api/Auth') export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Post('/Login')
  login(@Body() loginDTO: loginDTO) {
    return this.authService.login(loginDTO);
  }
  @Post('/Signup')
  async signup(@Body() signupDTO: signupDTO,@Res() res: Response) {
    res.send({
      message: 'Xử lí thành công!',
      content: ((await this.authService.signup(signupDTO)).message)
    });  }
  @Post('/Verify')
  async verify(@Body() body: { email: string; code: string },@Res() res: Response) {
    const { email, code } = body;
    res.send({
      message: 'Xử lí thành công!',
      content: ((await this.authService.verifyAccount(email,code)))
    });  }
  @Post('/forgot-password')
  async forgotPassword(@Body('email') email: string, @Res() res: Response) {
    res.send({
      message: 'Xử lí thành công!',
      content: ((await this.authService.forgotPassword(email)).message)
    });
  }

  // API xác thực mã xác thực quên mật khẩu
  @Post('/verify-forgot-password-code')
  async verifyForgotPasswordCode(
    @Body('email') email: string,
    @Body('verificationCode') verificationCode: string, @Res() res: Response
  ) {
    res.send({
      message: 'Xử lí thành công!',
      content: await this.authService.verifyForgotPasswordCode(email, verificationCode)
    });
  }

  // API đặt lại mật khẩu
  @Post('/reset-password')
  async resetPassword(@Body('email') email: string, @Res() res: Response, @Body('newPassword') newPassword: string) {
    res.send({
      message: 'Xử lí thành công!',
      content: await this.authService.resetPassword(email, newPassword)
    });
  }
}
