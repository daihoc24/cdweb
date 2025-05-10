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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const swagger_1 = require("@nestjs/swagger");
const signup_dto_1 = require("./dto/signup.dto");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    login(loginDTO) {
        return this.authService.login(loginDTO);
    }
    async signup(signupDTO, res) {
        res.send({
            message: 'Xử lí thành công!',
            content: ((await this.authService.signup(signupDTO)).message)
        });
    }
    async verify(body, res) {
        const { email, code } = body;
        res.send({
            message: 'Xử lí thành công!',
            content: ((await this.authService.verifyAccount(email, code)))
        });
    }
    async forgotPassword(email, res) {
        res.send({
            message: 'Xử lí thành công!',
            content: ((await this.authService.forgotPassword(email)).message)
        });
    }
    async verifyForgotPasswordCode(email, verificationCode, res) {
        res.send({
            message: 'Xử lí thành công!',
            content: await this.authService.verifyForgotPasswordCode(email, verificationCode)
        });
    }
    async resetPassword(email, res, newPassword) {
        res.send({
            message: 'Xử lí thành công!',
            content: await this.authService.resetPassword(email, newPassword)
        });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('/Login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.loginDTO]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('/Signup'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signup_dto_1.signupDTO, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('/Verify'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verify", null);
__decorate([
    (0, common_1.Post)('/forgot-password'),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('/verify-forgot-password-code'),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Body)('verificationCode')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyForgotPasswordCode", null);
__decorate([
    (0, common_1.Post)('/reset-password'),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)('newPassword')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('/api/Auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map