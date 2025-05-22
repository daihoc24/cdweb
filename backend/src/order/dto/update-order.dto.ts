import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, IsArray, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class UpdateOrderProductDto {
  @ApiProperty()
  @IsInt()
  products_id: number;

  @ApiProperty()
  @IsInt()
  quantity: number;
}

export class UpdateOrderDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  status?: string; 

  @ApiProperty({ required: false })
  @IsOptional()
  address: string;
  
  @ApiProperty({ type: [UpdateOrderProductDto], required: false })
  @IsArray()
  @IsOptional()
  @Type(() => UpdateOrderProductDto)
  orderProducts?: UpdateOrderProductDto[];
}
