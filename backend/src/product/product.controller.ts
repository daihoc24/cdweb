import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query, Put, Req, UseGuards, UseInterceptors, UploadedFiles, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Response } from 'express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/authGuard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiFile } from './apiFile';
import { diskStorage } from 'multer';
import { getData } from './interface';
import { CreateCommentDto } from './dto/create-comment.dto';

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
  @Get('/getListCommentByProductId/:productId')
  async getListCommentByProductId(@Res() res: Response, @Param('productId') productId: string) {
    res.send({
      message: 'Xử lí thành công!',
      content: (await this.productService.getListCommentByProductId(+productId)),
    });
  }
  @Get('/searchProductByName')
  async searchProductByName(@Res() res: Response, @Query('name') name: string,) {
    res.send({
      message: 'Xử lí thành công!',
      content: (await this.productService.searchProductByName(name))!.data,
    });
  }
  @Post('/upload-productImg/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @UseInterceptors(
    FilesInterceptor('file', 10, {
      storage: diskStorage({
        destination: process.cwd() + '/public/img',
        filename: (req, file, callback) => {
          const sanitizedFileName = file.originalname.replace(/\s+/g, '_');
          const uniqueFileName = `${new Date().getTime()}_${sanitizedFileName}`;
          callback(
            null,
            uniqueFileName,
          );
        }
      }),
    }),
  )
  async uploadImg(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('id') id: number,
    @Res() res: Response,
    @Req() req: getData,
  ) {
    if (req.user.role === 'admin') {
      for (const file of files) {
        const imagePath = file.path;
        const result = await this.productService.uploadProductImg(+id, imagePath);

        res.send({
          message: 'Xử lí thành công!',
          content: result,
        });
      }
    } else {
      throw new UnauthorizedException('Bạn không có quyền truy cập!');
    }
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/addComment/:productId')
  async addComment(@Body() CreateCommentDto: CreateCommentDto, @Param('productId') productId: number, @Res() res: Response
  ) {
    res.send({
      message: 'Xử lí thành công!',
      content: await this.productService.addComment(+productId, CreateCommentDto)
    });

  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/AddProduct')
  addProduct(@Body() CreateProductDto: CreateProductDto, @Req() req: getData
  ) {
    if (req.user.role === 'admin') {
      return this.productService.addProduct(CreateProductDto);
    } else {
      throw new UnauthorizedException('Bạn không có quyền truy cập!');
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('/UpdateProduct/:id')
  updateProduct(
    @Param('id') id: string,
    @Body() body: UpdateProductDto,
    @Req() req: getData,
  ) {
    if (req.user.role === 'admin') {
      return this.productService.updateProduct(+id, body);
    }
    throw new UnauthorizedException('Bạn không có quyền truy cập!');
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('/DeleteProduct/:id')
  deleteProduct(@Param('id') id: string
    , @Req() req: getData
  ) {
    if (req.user.role === 'admin') {
      return this.productService.deleteProduct(+id);
    }
    throw new UnauthorizedException('Bạn không có quyền truy cập!');
  }
  @ApiBearerAuth()
  @Delete('/deleteCommentById/:commentId')
  async deleteCommentById(@Param('commentId') commentId: string,  // Lấy commentId từ params
    @Body() body: { userId: number },  // Lấy userId từ body
    @Req() req: any,  // Request object để truy cập thông tin người dùng
    @Res() res: Response  // Để gửi phản hồi về client
  ) {
    await this.productService.deleteCommentById(+commentId, body.userId);
    return res.status(200).json({ message: 'Bình luận đã được xóa thành công.' });
  }
}
