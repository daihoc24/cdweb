import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    
    @ApiProperty()
    @IsNotEmpty()
    products_name: string;

    @ApiProperty()
    @IsNotEmpty()
    products_price: number;

    @ApiProperty()
    @IsNotEmpty()
    products_type: string;

}
