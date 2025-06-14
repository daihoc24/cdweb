import { AxiosResponse } from "axios";
import { request } from "../config/api";
import { payment } from "../interfaces/payment";
class PaymentService {
  validatePayment(orderId: number, data: payment) {
    return request({
      url: `/Payment/validate-payment/${orderId}`,
      method: "POST",
      data,
    });
  }
}
export const paymentService: PaymentService = new PaymentService();
