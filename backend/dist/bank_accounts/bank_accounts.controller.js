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
exports.BankAccountsController = void 0;
const common_1 = require("@nestjs/common");
const bank_accounts_service_1 = require("./bank_accounts.service");
const validatePayment_dto_1 = require("./dto/validatePayment.dto");
const swagger_1 = require("@nestjs/swagger");
const authGuard_1 = require("../auth/authGuard");
(0, swagger_1.ApiTags)('Payment');
let BankAccountsController = class BankAccountsController {
    paymenService;
    constructor(paymenService) {
        this.paymenService = paymenService;
    }
    async validatePayment(res, paymentData, orderId) {
        res.send({
            message: 'Xử lí thành công!',
            content: (await this.paymenService.validatePayment(paymentData, +orderId))
        });
    }
};
exports.BankAccountsController = BankAccountsController;
__decorate([
    (0, common_1.Post)('/validate-payment/:orderId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(authGuard_1.JwtAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, validatePayment_dto_1.ValidatePaymentDto, String]),
    __metadata("design:returntype", Promise)
], BankAccountsController.prototype, "validatePayment", null);
exports.BankAccountsController = BankAccountsController = __decorate([
    (0, common_1.Controller)('api/Payment'),
    __metadata("design:paramtypes", [bank_accounts_service_1.PaymentService])
], BankAccountsController);
//# sourceMappingURL=bank_accounts.controller.js.map