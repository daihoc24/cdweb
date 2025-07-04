"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("./order.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const update_order_dto_1 = require("./dto/update-order.dto");
const swagger_1 = require("@nestjs/swagger");
const authGuard_1 = require("../auth/authGuard");
(0, swagger_1.ApiTags)('Order');
let OrderController = class OrderController {
    orderService;
    constructor(orderService) {
        this.orderService = orderService;
    }
    async getListOrder(res) {
        res.send({
            message: 'Xử lí thành công!',
            content: ((await this.orderService.getListOrder()).data)
        });
    }
    async getListOrderByUserID(userId, res) {
        res.send({
            message: 'Xử lí thành công!',
            content: ((await this.orderService.getListOrderByUserID(+userId)).data)
        });
    }
    async getOrderById(orderId, res) {
        res.send({
            message: 'Xử lí thành công!',
            content: ((await this.orderService.getOrderById(+orderId)).data)
        });
    }
    createOrder(CreateOrderDto) {
        return this.orderService.createOrder(CreateOrderDto);
    }
    updateOrder(id, body, req) {
        if (req.user.role === 'admin') {
            return this.orderService.updateOrder(+id, body);
        }
        throw new common_1.UnauthorizedException('Bạn không có quyền truy cập!');
    }
    deleteOrder(id, req) {
        if (req.user.role === 'admin') {
            return this.orderService.deleteOrder(+id);
        }
        throw new common_1.UnauthorizedException('Bạn không có quyền truy cập!');
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.Get)('/getListOrder'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getListOrder", null);
__decorate([
    (0, common_1.Get)('/getListOrderByUserID/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getListOrderByUserID", null);
__decorate([
    (0, common_1.Get)('/getOrderById/:orderId'),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getOrderById", null);
__decorate([
    (0, common_1.Post)('/createOrder'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(authGuard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Put)('/UpdateOrder/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(authGuard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_dto_1.UpdateOrderDto, Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "updateOrder", null);
__decorate([
    (0, common_1.Delete)('/DeleteOrder/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(authGuard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "deleteOrder", null);
exports.OrderController = OrderController = __decorate([
    (0, common_1.Controller)('api/Order'),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
//# sourceMappingURL=order.controller.js.map