import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { getData } from './interface';

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
  @Post('/creatUser')
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  async creatUser(@Body() CreateUserDto: CreateUserDto,
    @Req() req: getData, @Res() res: Response
  ) {
    // if (req.user.role === 'admin') {
    res.send({
      message: 'Xử lí thành công!',
      content: ((await this.userService.createUser(CreateUserDto)))
    });    // }
    // throw new UnauthorizedException('Bạn không có quyền hạn truy cập!');
  }
}
