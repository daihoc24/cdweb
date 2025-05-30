"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let PaymentService = class PaymentService {
    prisma = new client_1.PrismaClient();
    async validatePayment(paymentData, orderID) {
        try {
            const account = await this.prisma.bank_accounts.findFirst({
                where: {
                    account_number: paymentData.account_number,
                    account_name: paymentData.account_name,
                    bank_name: paymentData.bank_name,
                    content: paymentData.content,
                },
            });
            if (account) {
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
                const remainingAmount = paymentData.amount - order.totalAmount;
                if (remainingAmount < 0) {
                    return { success: false, message: 'Số tiền thanh toán không đủ!' };
                }
                const transaction = await this.prisma.$transaction(async (prisma) => {
                    const orderUpdate = await prisma.order.update({
                        where: { order_id: orderID },
                        data: {
                            status: 'Đã thanh toán',
                        },
                    });
                    const updateProductPromises = order.OrderProduct.map((orderProduct) => prisma.product.update({
                        where: { products_id: orderProduct.products_id },
                        data: {
                            quantitySold: { increment: orderProduct.quantity },
                        },
                    }));
                    await Promise.all(updateProductPromises);
                    await prisma.bank_accounts.update({
                        where: { id: account.id },
                        data: {
                            money: account.money - order.totalAmount,
                        },
                    });
                    return orderUpdate;
                });
                if (remainingAmount > 0) {
                    return { success: true, message: `Thanh toán thành công! Số tiền dư: ${remainingAmount} VND` };
                }
                return { success: true, message: 'Thanh toán thành công!' };
            }
            return { success: false, message: 'Thông tin không hợp lệ!' };
        }
        catch (error) {
            console.error(error);
            throw new Error('Đã xảy ra lỗi khi kiểm tra thanh toán!');
        }
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)()
], PaymentService);
//# sourceMappingURL=bank_accounts.service.js.map