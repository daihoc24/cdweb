import { AxiosResponse } from "axios";
import { request } from "../config/api";
import { createOrder, Order, updateOrder } from "../interfaces/order";

class OrderService {
  getListOrderByUserID(
    userId: number | undefined
  ): Promise<AxiosResponse<any>> {
    return request({
      url: `/Order/getListOrderByUserID/${userId}`,
      method: "GET",
    });
  }
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
  getListOrder() {
    return request({
      url: `/Order/getListOrder`,
      method: "GET",
    });
  }
  deleteOrder(id: number) {
    return request({
      url: `/Order/DeleteOrder/${id}`,
      method: "DELETE",
    });
  }
  updateOrder(id: number, data: updateOrder) {
    return request({
      url: `/Order/UpdateOrder/${id}`,
      method: "PUT",
      data,
    });
  }
}

export const orderService = new OrderService();
