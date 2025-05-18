import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Response } from 'express';
import { getData } from './interface';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    getListProduct(res: Response): Promise<void>;
    getProductInfor(id: string, res: Response): Promise<void>;
    getListCommentByProductId(res: Response, productId: string): Promise<void>;
    searchProductByName(res: Response, name: string): Promise<void>;
    uploadImg(files: Array<Express.Multer.File>, id: number, res: Response, req: getData): Promise<void>;
    addComment(CreateCommentDto: CreateCommentDto, productId: number, res: Response): Promise<void>;
    addProduct(CreateProductDto: CreateProductDto, req: getData): Promise<{
        product: {
            products_name: string | null;
            products_price: number | null;
            products_type: string | null;
            quantitySold: number | null;
            products_id: number;
            products_image: string | null;
        };
    }>;
    updateProduct(id: string, body: UpdateProductDto, req: getData): Promise<{
        product: {
            products_name: string | null;
            products_price: number | null;
            products_type: string | null;
            quantitySold: number | null;
            products_id: number;
            products_image: string | null;
        };
    } | undefined>;
    deleteProduct(id: string, req: getData): Promise<{
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
    deleteCommentById(commentId: string, body: {
        userId: number;
    }, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
}
