import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateProductDto {

    @ApiProperty()
    @IsNotEmpty()
    products_name: string;

    @ApiProperty()
    @IsNumber()
    products_price: number;

    @ApiProperty()
    @IsNotEmpty()
    products_type: string;

    // @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    quantitySold?: number;
}
