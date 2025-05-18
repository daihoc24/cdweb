import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
export class CreateCommentDto {

    @ApiProperty()
    @IsNotEmpty()
    user_id: number;

    @ApiProperty()
    @IsNotEmpty()
    user_fullname: string;
    
    @ApiProperty()
    @IsNotEmpty()
    content: string;
}