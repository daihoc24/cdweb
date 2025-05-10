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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const swagger_1 = require("@nestjs/swagger");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async getListUser(res) {
        res.send({
            message: 'Xử lí thành công!',
            content: ((await this.userService.getListUser()).users)
        });
    }
    async getUserInfor(userId, res) {
        res.send({
            message: 'Xử lí thành công!',
            content: ((await this.userService.getUserInfor(+userId)).data)
        });
    }
    async creatUser(CreateUserDto, req, res) {
        res.send({
            message: 'Xử lí thành công!',
            content: ((await this.userService.createUser(CreateUserDto)))
        });
    }
    async updatePassword(updatePasswordDto, userId, req, res) {
        const updatedUser = await this.userService.updatePassword(+userId, updatePasswordDto);
        return res.status(200).json({
            message: 'Password updated successfully',
            content: updatedUser,
        });
    }
    async updateUser(userId, body, req, res) {
        res.send({
            message: 'Xử lí thành công!',
            content: ((await this.userService.updateUser(+userId, body)))
        });
        throw new common_1.UnauthorizedException('Bạn không có quyền truy cập!');
    }
    deleteUser(userId, req) {
        if (req.user.role === 'admin') {
            return this.userService.deleteUser(+userId);
        }
        throw new common_1.UnauthorizedException('Bạn không có quyền truy cập!');
    }
    async searchUserByName(res, name) {
        res.send({
            message: 'Xử lí thành công!',
            content: (await this.userService.searchUserByName(name))?.data,
        });
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)('/getListUser'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getListUser", null);
__decorate([
    (0, common_1.Get)('/UserInformation/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserInfor", null);
__decorate([
    (0, common_1.Post)('/creatUser'),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "creatUser", null);
__decorate([
    (0, common_1.Post)('/update-password/:userId'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Put)('/UpdateUser/:userId'),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)('/DeleteUser/:userId'),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Get)('/searchUserByName'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "searchUserByName", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('User'),
    (0, common_1.Controller)('api/User'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map