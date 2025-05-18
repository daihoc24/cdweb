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
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const product_service_1 = require("./product.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const swagger_1 = require("@nestjs/swagger");
const authGuard_1 = require("../auth/authGuard");
const platform_express_1 = require("@nestjs/platform-express");
const apiFile_1 = require("./apiFile");
const multer_1 = require("multer");
const create_comment_dto_1 = require("./dto/create-comment.dto");
let ProductController = class ProductController {
    productService;
    constructor(productService) {
        this.productService = productService;
    }
    async getListProduct(res) {
        res.send({
            message: 'Xử lí thành công!',
            content: (await this.productService.getListProduct()).product,
        });
    }
    async getProductInfor(id, res) {
        res.send({
            message: 'Xử lí thành công!',
            content: (await this.productService.getProductInfor(+id)).product,
        });
    }
    async getListCommentByProductId(res, productId) {
        res.send({
            message: 'Xử lí thành công!',
            content: (await this.productService.getListCommentByProductId(+productId)),
        });
    }
    async searchProductByName(res, name) {
        res.send({
            message: 'Xử lí thành công!',
            content: (await this.productService.searchProductByName(name)).data,
        });
    }
    async uploadImg(files, id, res, req) {
        if (req.user.role === 'admin') {
            for (const file of files) {
                const imagePath = file.path;
                const result = await this.productService.uploadProductImg(+id, imagePath);
                res.send({
                    message: 'Xử lí thành công!',
                    content: result,
                });
            }
        }
        else {
            throw new common_1.UnauthorizedException('Bạn không có quyền truy cập!');
        }
    }
    async addComment(CreateCommentDto, productId, res) {
        res.send({
            message: 'Xử lí thành công!',
            content: await this.productService.addComment(+productId, CreateCommentDto)
        });
    }
    addProduct(CreateProductDto, req) {
        if (req.user.role === 'admin') {
            return this.productService.addProduct(CreateProductDto);
        }
        else {
            throw new common_1.UnauthorizedException('Bạn không có quyền truy cập!');
        }
    }
    updateProduct(id, body, req) {
        if (req.user.role === 'admin') {
            return this.productService.updateProduct(+id, body);
        }
        throw new common_1.UnauthorizedException('Bạn không có quyền truy cập!');
    }
    deleteProduct(id, req) {
        if (req.user.role === 'admin') {
            return this.productService.deleteProduct(+id);
        }
        throw new common_1.UnauthorizedException('Bạn không có quyền truy cập!');
    }
    async deleteCommentById(commentId, body, req, res) {
        await this.productService.deleteCommentById(+commentId, body.userId);
        return res.status(200).json({ message: 'Bình luận đã được xóa thành công.' });
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Get)('/GetListProduct'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getListProduct", null);
__decorate([
    (0, common_1.Get)('/ProductInformation/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getProductInfor", null);
__decorate([
    (0, common_1.Get)('/getListCommentByProductId/:productId'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getListCommentByProductId", null);
__decorate([
    (0, common_1.Get)('/searchProductByName'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "searchProductByName", null);
__decorate([
    (0, common_1.Post)('/upload-productImg/:id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(authGuard_1.JwtAuthGuard),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, apiFile_1.ApiFile)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('file', 10, {
        storage: (0, multer_1.diskStorage)({
            destination: process.cwd() + '/public/img',
            filename: (req, file, callback) => {
                const sanitizedFileName = file.originalname.replace(/\s+/g, '_');
                const uniqueFileName = `${new Date().getTime()}_${sanitizedFileName}`;
                callback(null, uniqueFileName);
            }
        }),
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "uploadImg", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(authGuard_1.JwtAuthGuard),
    (0, common_1.Post)('/addComment/:productId'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('productId')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_comment_dto_1.CreateCommentDto, Number, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "addComment", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(authGuard_1.JwtAuthGuard),
    (0, common_1.Post)('/AddProduct'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_1.CreateProductDto, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "addProduct", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(authGuard_1.JwtAuthGuard),
    (0, common_1.Put)('/UpdateProduct/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "updateProduct", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(authGuard_1.JwtAuthGuard),
    (0, common_1.Delete)('/DeleteProduct/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "deleteProduct", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Delete)('/deleteCommentById/:commentId'),
    __param(0, (0, common_1.Param)('commentId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "deleteCommentById", null);
exports.ProductController = ProductController = __decorate([
    (0, common_1.Controller)('product'),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductController);
//# sourceMappingURL=product.controller.js.map