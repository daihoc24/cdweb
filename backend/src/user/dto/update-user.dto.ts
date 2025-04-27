import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  user_fullname: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  user_email: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  user_password: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  user_phone: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  user_birthDate: Date;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  user_role: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  user_address: string;

}
