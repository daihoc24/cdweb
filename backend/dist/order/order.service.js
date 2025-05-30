"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const axios_1 = require("axios");
let OrderService = class OrderService {
    prisma = new client_1.PrismaClient();
    driverLatitude = 10.88072665583552;
    driverLongitude = 106.78459883974683;
    async simulateTravelTime(latitude, longitude) {
        const estimatedTime = await this.getTravelTime(this.driverLatitude, this.driverLongitude, latitude, longitude);
        return estimatedTime;
    }
    moveDriverTowardsDestination(destinationLatitude, destinationLongitude) {
        const latDiff = destinationLatitude - this.driverLatitude;
        const lonDiff = destinationLongitude - this.driverLongitude;
        this.driverLatitude += latDiff * 0.01;
        this.driverLongitude += lonDiff * 0.01;
    }
    startSimulatedDriverMovement(orderId, destinationLatitude, destinationLongitude) {
        const latDiff = destinationLatitude - this.driverLatitude;
        const lonDiff = destinationLongitude - this.driverLongitude;
        const interval = setInterval(async () => {
            this.moveDriverTowardsDestination(destinationLatitude, destinationLongitude);
            if (Math.abs(this.driverLatitude - destinationLatitude) < 0.0001 && Math.abs(this.driverLongitude - destinationLongitude) < 0.0001) {
                clearInterval(interval);
                console.log('Tài xế đã đến đích!');
                await this.updateOrderStatus(orderId, 'Hoàn thành');
            }
            const estimatedTime = await this.simulateTravelTime(destinationLatitude, destinationLongitude);
            await this.updateOrderTime(orderId, estimatedTime);
        }, 1000);
    }
    async updateOrderTime(orderId, estimatedTime) {
        await this.prisma.order.update({
            where: { order_id: orderId },
            data: {
                thoiGian: estimatedTime,
            },
        });
        console.log(`Thời gian đã được cập nhật thành: ${estimatedTime}`);
    }
    async updateOrderStatus(orderId, status) {
        await this.prisma.order.update({
            where: { order_id: orderId },
            data: {
                status: status,
            },
        });
        console.log(`Trạng thái đơn hàng đã được cập nhật thành: ${status}`);
    }
    async getListOrder() {
        try {
            const data = await this.prisma.order.findMany({
                include: {
                    User: {
                        select: {
                            user_fullname: true,
                            user_phone: true,
                        },
                    },
                    OrderProduct: {
                        select: {
                            quantity: true,
                            Product: {
                                select: {
                                    products_id: true,
                                    products_name: true,
                                    products_price: true,
                                    products_image: true,
                                },
                            },
                        },
                    },
                },
            });
            return { data };
        }
        catch (err) {
            throw new Error(`Error getting users: ${err}`);
        }
    }
    async getListOrderByUserID(userId) {
        try {
            const data = await this.prisma.order.findMany({
                where: {
                    user_id: userId,
                },
                include: {
                    User: {
                        select: {
                            user_fullname: true,
                            user_phone: true,
                        },
                    },
                    OrderProduct: {
                        select: {
                            quantity: true,
                            Product: {
                                select: {
                                    products_name: true,
                                    products_price: true,
                                    products_image: true,
                                },
                            },
                        },
                    },
                },
            });
            return { data };
        }
        catch (err) {
            throw new Error(`Error getting orders by userId: ${err}`);
        }
    }
    async getOrderById(orderId) {
        try {
            const data = await this.prisma.order.findUnique({
                where: {
                    order_id: orderId,
                },
                include: {
                    User: {
                        select: {
                            user_fullname: true,
                            user_phone: true,
                        },
                    },
                    OrderProduct: {
                        select: {
                            quantity: true,
                            Product: {
                                select: {
                                    products_id: true,
                                    products_name: true,
                                    products_price: true,
                                    products_image: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!data) {
                throw new Error(`Order with id ${orderId} not found`);
            }
            return { data };
        }
        catch (err) {
            throw new Error(`Error getting order: ${err}`);
        }
    }
    async createOrder(body) {
        const { user_id, address, orderProducts, phiShip = 15000 } = body;
        if (!address) {
            throw new Error('Không tìm thấy địa chỉ');
        }
        const { latitude, longitude } = await this.getCoordinates(address);
        const estimatedTime = await this.getTravelTime(this.driverLatitude, this.driverLongitude, latitude, longitude);
        let totalAmount = 0;
        for (const orderProduct of orderProducts) {
            const product = await this.prisma.product.findUnique({
                where: { products_id: orderProduct.products_id },
            });
            if (product && product.products_price) {
                totalAmount += product.products_price * orderProduct.quantity;
            }
        }
        const order = await this.prisma.order.create({
            data: {
                user_id,
                address,
                status: 'Đang xử lí',
                phiShip,
                thoiGian: estimatedTime,
                totalAmount: totalAmount + phiShip,
                OrderProduct: {
                    create: orderProducts.map((item) => ({
                        quantity: item.quantity,
                        products_id: item.products_id,
                    })),
                },
            },
        });
        return order;
    }
    async updateOrder(id, body) {
        const { status, address, orderProducts } = body;
        const existingOrder = await this.prisma.order.findUnique({
            where: { order_id: id },
            include: { OrderProduct: true },
        });
        if (!existingOrder) {
            throw new Error('Order not found');
        }
        let updatedTime = existingOrder.thoiGian;
        if (status === 'Đang giao hàng') {
            if (address) {
                const { latitude, longitude } = await this.getCoordinates(address);
                this.startSimulatedDriverMovement(id, latitude, longitude);
                updatedTime = await this.simulateTravelTime(latitude, longitude);
            }
        }
        let totalAmount = existingOrder.totalAmount || 0;
        if (orderProducts && orderProducts.length > 0) {
            totalAmount = 0;
            for (const orderProduct of orderProducts) {
                const product = await this.prisma.product.findUnique({
                    where: { products_id: orderProduct.products_id },
                });
                if (product && product.products_price) {
                    totalAmount += product.products_price * orderProduct.quantity;
                }
            }
        }
        const updatedOrder = await this.prisma.order.update({
            where: { order_id: id },
            data: {
                status,
                address,
                thoiGian: updatedTime,
                totalAmount,
                OrderProduct: orderProducts
                    ? {
                        deleteMany: {},
                        create: orderProducts.map((item) => ({
                            products_id: item.products_id,
                            quantity: item.quantity,
                        })),
                    }
                    : undefined,
            },
        });
        return updatedOrder;
    }
    async deleteOrder(id) {
        try {
            const deletedOrder = await this.prisma.order.delete({
                where: { order_id: id },
            });
            return {
                message: 'Order deleted successfully',
                deletedOrder,
            };
        }
        catch (error) {
            throw new Error(`Error deleting order: ${error.message}`);
        }
    }
    async getCoordinates(address) {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`;
        try {
            const response = await axios_1.default.get(url, {
                headers: {
                    'User-Agent': 'back-end/0.0.1 (hoangquy4874@gmail.com)',
                },
            });
            const data = response.data;
            if (data && data.length > 0) {
                return { latitude: data[0].lat, longitude: data[0].lon };
            }
            else {
                throw new Error('Không tìm thấy kết quả cho địa chỉ này');
            }
        }
        catch (error) {
            throw new Error(`Lỗi khi gọi Nominatim API: ${error.message}`);
        }
    }
    async getTravelTime(startLat, startLon, endLat, endLon) {
        const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=false&geometries=geojson`;
        try {
            const response = await axios_1.default.get(osrmUrl);
            const duration = response.data.routes[0].duration;
            const minutes = Math.floor(duration / 60);
            const seconds = Math.floor(duration % 60);
            return `${minutes} phút ${seconds} giây`;
        }
        catch (error) {
            console.error('Lỗi khi tính toán thời gian di chuyển:', error);
            throw new Error('Không thể tính toán thời gian di chuyển');
        }
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)()
], OrderService);
//# sourceMappingURL=order.service.js.map