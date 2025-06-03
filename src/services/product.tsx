import { AxiosResponse } from "axios";
import {
    addComment,
    addProduct,
    listProduct,
    ProductResponse,
} from "../interfaces/product";

import { request } from "../config/api";
class ProductService {
    fetchProductApi(): Promise<AxiosResponse<ProductResponse>> {
        return request({
            url: `/Product/GetListProduct`,
            method: "GET",
        });
    }
    fetchProductDetailApi(products_id: number): Promise<AxiosResponse<any>> {
        return request({
            url: `/Product/ProductInformation/${products_id}`,
            method: "GET",
        });
    }
    getListCommentByProductId(productId: number) {
        return request({
            url: `/Product/getListCommentByProductId/${productId}`,
            method: "GET",
        });
    }
    addComment(productId: number, data: addComment) {
        return request({
            url: `/Product/addComment/${productId}`,
            method: "POST",
            data,
        });
    }
    deleteCommentById(commentId: number, userId: number) {
        return request({
            url: `/Product/deleteCommentById/${commentId}`,
            method: "DELETE",
            data: { userId },
        });
    }
}

export const productService: ProductService = new ProductService();