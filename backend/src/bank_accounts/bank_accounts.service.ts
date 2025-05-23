import { Injectable } from '@nestjs/common';
import { ValidatePaymentDto } from './dto/validatePayment.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PaymentService {
  prisma = new PrismaClient();

  async validatePayment(paymentData: ValidatePaymentDto, orderID: number): Promise<{ success: boolean; message: string }> {
    try {
      // Kiểm tra tài khoản thanh toán
      const account = await this.prisma.bank_accounts.findFirst({
        where: {
          account_number: paymentData.account_number,
          account_name: paymentData.account_name,
          bank_name: paymentData.bank_name,
          content: paymentData.content,
        },
      });

      if (account) {
        // Lấy thông tin đơn hàng từ cơ sở dữ liệu
        const order = await this.prisma.order.findUnique({
          where: { order_id: orderID },
          include: { OrderProduct: true },
        });

        if (!order) {
          return { success: false, message: 'Đơn hàng không tồn tại!' };
        }

        if (order.status === 'Đã thanh toán') {
          return { success: false, message: 'Đơn hàng đã thanh toán trước đó!' };
        }

        const remainingAmount = paymentData.amount - order.totalAmount!;

        if (remainingAmount < 0) {
          return { success: false, message: 'Số tiền thanh toán không đủ!' };
        }

        // Sử dụng giao dịch để thực hiện tất cả các cập nhật đồng thời
        const transaction = await this.prisma.$transaction(async (prisma) => {
          // Cập nhật trạng thái đơn hàng thành 'Đã thanh toán'
          const orderUpdate = await prisma.order.update({
            where: { order_id: orderID },
            data: {
              status: 'Đã thanh toán',
            },
          });

          // Cập nhật quantitySold cho các sản phẩm trong đơn hàng
          const updateProductPromises = order.OrderProduct.map((orderProduct) =>
            prisma.product.update({
              where: { products_id: orderProduct.products_id! },
              data: {
                quantitySold: { increment: orderProduct.quantity! }, // Cộng thêm số lượng đã bán
              },
            }),
          );

          await Promise.all(updateProductPromises);

          // Cập nhật số tiền trong tài khoản ngân hàng
          await prisma.bank_accounts.update({
            where: { id: account.id },
            data: {
              money: account.money! - order.totalAmount!, // Trừ số tiền thanh toán khỏi tài khoản
            },
          });

          return orderUpdate; // Trả về kết quả cập nhật đơn hàng
        });

        // Kiểm tra số tiền dư và thông báo
        if (remainingAmount > 0) {
          return { success: true, message: `Thanh toán thành công! Số tiền dư: ${remainingAmount} VND` };
        }

        return { success: true, message: 'Thanh toán thành công!' };
      }

      return { success: false, message: 'Thông tin không hợp lệ!' };
    } catch (error) {
      console.error(error);
      throw new Error('Đã xảy ra lỗi khi kiểm tra thanh toán!');
    }
  }
}

