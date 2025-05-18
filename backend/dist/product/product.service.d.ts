import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class ProductService {
    prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
    getListProduct(): Promise<{
        product: {
            products_name: string | null;
            products_price: number | null;
            products_type: string | null;
            quantitySold: number | null;
            products_id: number;
            products_image: string | null;
        }[];
    }>;
    getProductInfor(id: number): Promise<{
        product: {
            products_name: string | null;
            products_price: number | null;
            products_type: string | null;
            quantitySold: number | null;
            products_id: number;
            products_image: string | null;
        } | null;
    }>;
    getListCommentByProductId(productId: number): Promise<{
        user_fullname: string;
        user_id: number;
        content: string | null;
        comment_id: number;
        product_id: number;
        created_at: Date | null;
    }[]>;
    searchProductByName(name: string): Promise<{
        data: {
            products_name: string | null;
            products_price: number | null;
            products_type: string | null;
            quantitySold: number | null;
            products_id: number;
            products_image: string | null;
        }[];
    } | undefined>;
    addComment(productId: number, body: CreateCommentDto): Promise<{
        comment: {
            user_fullname: string;
            user_id: number;
            content: string | null;
            comment_id: number;
            product_id: number;
            created_at: Date | null;
        };
    }>;
    addProduct(body: CreateProductDto): Promise<{
        product: {
            products_name: string | null;
            products_price: number | null;
            products_type: string | null;
            quantitySold: number | null;
            products_id: number;
            products_image: string | null;
        };
    }>;
    uploadProductImg(id: number, image: string): Promise<{
        data: {
            products_name: string | null;
            products_price: number | null;
            products_type: string | null;
            quantitySold: number | null;
            products_id: number;
            products_image: string | null;
        };
    }>;
    updateProduct(id: number, body: UpdateProductDto): Promise<{
        product: {
            products_name: string | null;
            products_price: number | null;
            products_type: string | null;
            quantitySold: number | null;
            products_id: number;
            products_image: string | null;
        };
    } | undefined>;
    deleteProduct(id: number): Promise<{
        message: string;
        product: {
            products_name: string | null;
            products_price: number | null;
            products_type: string | null;
            quantitySold: number | null;
            products_id: number;
            products_image: string | null;
        };
    } | undefined>;
    deleteCommentById(commentId: number, userId: number): Promise<{
        message: string;
        deletedComment: {
            user_fullname: string;
            user_id: number;
            content: string | null;
            comment_id: number;
            product_id: number;
            created_at: Date | null;
        };
    }>;
}
