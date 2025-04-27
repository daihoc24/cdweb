import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('User')
@Controller('api/User') export class UserController {
  constructor(private readonly userService: UserService) { }
  @Get('/getListUser')
  async getListUser(@Res() res: Response) {
    res.send({
      message: 'Xử lí thành công!',
      content: ((await this.userService.getListUser()).users)
    });
  }

  @Get('/UserInformation/:userId')
  // @UseGuards(JwtAuthGuard)
  async getUserInfor(@Param('userId') userId: number, @Res() res: Response) {
    res.send({
      message: 'Xử lí thành công!',
      content: ((await this.userService.getUserInfor(+userId)).data)
    });
  }
}
