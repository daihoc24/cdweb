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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOrderDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class UpdateOrderProductDto {
    products_id;
    quantity;
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateOrderProductDto.prototype, "products_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateOrderProductDto.prototype, "quantity", void 0);
class UpdateOrderDto {
    status;
    address;
    orderProducts;
}
exports.UpdateOrderDto = UpdateOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateOrderDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [UpdateOrderProductDto], required: false }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => UpdateOrderProductDto),
    __metadata("design:type", Array)
], UpdateOrderDto.prototype, "orderProducts", void 0);
//# sourceMappingURL=update-order.dto.js.map