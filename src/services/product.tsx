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
    deleteProduct(id: number) {
        return request({
            url: `/Product/DeleteProduct/${id}`,
            method: "DELETE",
        });
    }
    uploadImg(productId: number, data: FormData) {
        return request({
            url: `/Product/upload-productImg/${productId}`,
            method: "POST",
            data,
        });
    }
    searchProductByName(name: any) {
        return request({
            url: `/Product/searchProductByName?name=${name}`,
            method: "GET",
        });
    }
    addProduct(data: addProduct) {
        return request({
            url: `/Product/AddProduct`,
            method: "POST",
            data,
        });
    }
    updateProduct(id: number, data: addProduct) {
        return request({
            url: `/Product/UpdateProduct/${id}`,
            method: "PUT",
            data,
        });
    }
}

export const productService: ProductService = new ProductService();