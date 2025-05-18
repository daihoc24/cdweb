import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { CreateCommentDto } from './dto/create-comment.dto';

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
      throw new Error("Can't find ID product!");
    }
  }
  async getListCommentByProductId(productId: number) {
    try {
      const comments = await this.prisma.productComment.findMany({
        where: { product_id: productId },
        orderBy: { created_at: 'desc' },  // Sắp xếp theo ngày tạo (mới nhất lên đầu)
      });

      return comments;
    } catch (error) {
      throw new Error(`Error fetching comments: ${error}`);
    }
  }

  async searchProductByName(name: string) {
    try {
      const data = await this.prisma.product.findMany({
        where: {
          products_name: {
            contains: name,
          },
        },
      });
      return { data };
    } catch { }
  }
  async addComment(productId: number, body: CreateCommentDto) {
    try {
      const comment = await this.prisma.productComment.create({
        data: {
          user_id: body.user_id,
          user_fullname: body.user_fullname,
          content: body.content,
          product_id: productId,
        }
      });

      return { comment };
    } catch (err) {
      throw new Error(`Error adding comment: ${err}`);
    }
  }

  async addProduct(body: CreateProductDto) {
    try {
      const productData = {
        ...body,
        quantitySold: body.quantitySold ?? 0,
      };

      const product = await this.prisma.product.create({
        data: productData,
      });

      return { product };
    } catch (err) {
      throw new Error(`Error creating product: ${err}`);
    }
  }

  async uploadProductImg(id: number, image: string) {
    try {
      const data = await this.prisma.product.findUnique({
        where: {
          products_id: id,
        },
      });
      if (!data) {
        throw new Error(`Product with id ${id} not found`);
      }

      // Xử lý đường dẫn ảnh: chỉ lấy tên ảnh từ đường dẫn file
      // Loại bỏ phần đường dẫn tuyệt đối
      const imagePath = image.replace(process.cwd() + '\\public\\img\\', '');
      const publicUrl = `http://localhost:8080/public/img/${imagePath}`;
      const upload = await this.prisma.product.update({
        where: {
          products_id: id,
        },
        data: {
          products_image: publicUrl, // Lưu đường dẫn ảnh tương đối
        },
      });

      return { data: upload };
    } catch (err) {
      throw new Error(`Error uploading image: ${err.message}`);
    }
  }


  async updateProduct(id: number, body: UpdateProductDto) {
    try {
      const productExists = await this.prisma.product.findUnique({
        where: { products_id: id },
      });

      if (!productExists) {
        throw new Error(`Product with id ${id} not exits!`);
      }

      const product = await this.prisma.product.update({
        where: {
          products_id: id,
        },
        data: body,
      });
      return { product };
    } catch { }
  }
  async deleteProduct(id: number) {
    try {
      const product = await this.prisma.product.delete({
        where: {
          products_id: id,
        },
      });
      return {
        message: 'Order deleted successfully!',
        product,
      };
    } catch { }
  }
  async deleteCommentById(commentId: number, userId: number) {
    try {
      // Kiểm tra nếu comment tồn tại và kiểm tra xem user_id có phải là của comment này không
      const comment = await this.prisma.productComment.findUnique({
        where: {
          comment_id: commentId,
        },
      });

      // Nếu không tìm thấy comment hoặc comment không thuộc về user này
      if (!comment) {
        throw new Error("Comment not found.");
      }
      if (comment.user_id !== userId) {
        throw new Error("You are not authorized to delete this comment.");
      }

      // Xóa comment
      const deletedComment = await this.prisma.productComment.delete({
        where: {
          comment_id: commentId,
        },
      });

      return { message: "Comment deleted successfully!", deletedComment };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
