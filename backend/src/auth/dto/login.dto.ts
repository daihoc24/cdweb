import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class loginDTO {
  @ApiProperty()
  @IsEmail()
  user_email: string;

  @ApiProperty()
  @IsNotEmpty()
  user_password: string;
}