import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ProductService {
  prisma = new PrismaClient();

  async getListProduct() {
    try {
      const product = await this.prisma.product.findMany({
        select: {
          products_id: true,
          products_name: true,
          products_image: true,
          products_price: true,
          quantitySold: true,
          products_type: true,
        },
      });
      return { product };
    } catch (error) {
      console.error(error);
      throw new Error("Can't retrieve products!");
    }
  }
  async getProductInfor(id: number) {
    try {

      const product = await this.prisma.product.findUnique({
        where: {
          products_id: id,
        }
      });
      return { product };
    } catch {
      throw new Error("Can't find productID!");
    }
  }

}
