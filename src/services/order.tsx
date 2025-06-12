import { AxiosResponse } from "axios";
import { request } from "../config/api";
import { createOrder } from "../interfaces/order";

class OrderService {
    getOrderById(orderId: number | undefined): Promise<AxiosResponse<any>> {
        return request({
            url: `/Order/getOrderById/${orderId}`,
            method: "GET",
        });
    }
    createOrder(data: createOrder) {
        return request({
            url: "/Order/createOrder",
            method: "POST",
            data,
        });
    }
}
export const orderService = new OrderService();

