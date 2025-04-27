import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  user_fullname: string;

  @ApiProperty()
  @IsEmail()
  user_email: string;

  @ApiProperty()
  @IsNotEmpty()
  user_password: string;

  @ApiProperty()
  @IsNotEmpty()
  user_phone: string;

  @ApiProperty()
  @IsNotEmpty()
  user_birthDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  user_role: string;

  @ApiProperty()
  @IsNotEmpty()
  user_address:string;
}

