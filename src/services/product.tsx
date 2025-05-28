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
}

export const productService: ProductService = new ProductService();