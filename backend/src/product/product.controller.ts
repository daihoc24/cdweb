import { Controller, Get, Param, Res } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Response } from 'express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Get('/GetListProduct')
  async getListProduct(@Res() res: Response) {
    res.send({
      message: 'Xử lí thành công!',
      content: (await this.productService.getListProduct()).product,
    });
  }
  @Get('/ProductInformation/:id')
  async getProductInfor(@Param('id') id: string, @Res() res: Response) {
    res.send({
      message: 'Xử lí thành công!',
      content: (await this.productService.getProductInfor(+id)).product,
    });
  }
}
