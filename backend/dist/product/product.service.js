"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let ProductService = class ProductService {
    prisma = new client_1.PrismaClient();
    async getListProduct() {
        try {
            const product = await this.prisma.product.findMany({
                select: {
                    products_id: true,
                    products_name: true,
                    products_image: true,
                    products_price: true,
                    quantitySold: true,
                    products_type: true,
                },
            });
            return { product };
        }
        catch (error) {
            console.error(error);
            throw new Error("Can't retrieve products!");
        }
    }
    async getProductInfor(id) {
        try {
            const product = await this.prisma.product.findUnique({
                where: {
                    products_id: id,
                }
            });
            return { product };
        }
        catch {
            throw new Error("Can't find ID product!");
        }
    }
    async getListCommentByProductId(productId) {
        try {
            const comments = await this.prisma.productComment.findMany({
                where: { product_id: productId },
                orderBy: { created_at: 'desc' },
            });
            return comments;
        }
        catch (error) {
            throw new Error(`Error fetching comments: ${error}`);
        }
    }
    async searchProductByName(name) {
        try {
            const data = await this.prisma.product.findMany({
                where: {
                    products_name: {
                        contains: name,
                    },
                },
            });
            return { data };
        }
        catch { }
    }
    async addComment(productId, body) {
        try {
            const comment = await this.prisma.productComment.create({
                data: {
                    user_id: body.user_id,
                    user_fullname: body.user_fullname,
                    content: body.content,
                    product_id: productId,
                }
            });
            return { comment };
        }
        catch (err) {
            throw new Error(`Error adding comment: ${err}`);
        }
    }
    async addProduct(body) {
        try {
            const productData = {
                ...body,
                quantitySold: body.quantitySold ?? 0,
            };
            const product = await this.prisma.product.create({
                data: productData,
            });
            return { product };
        }
        catch (err) {
            throw new Error(`Error creating product: ${err}`);
        }
    }
    async uploadProductImg(id, image) {
        try {
            const data = await this.prisma.product.findUnique({
                where: {
                    products_id: id,
                },
            });
            if (!data) {
                throw new Error(`Product with id ${id} not found`);
            }
            const imagePath = image.replace(process.cwd() + '\\public\\img\\', '');
            const publicUrl = `http://localhost:8080/public/img/${imagePath}`;
            const upload = await this.prisma.product.update({
                where: {
                    products_id: id,
                },
                data: {
                    products_image: publicUrl,
                },
            });
            return { data: upload };
        }
        catch (err) {
            throw new Error(`Error uploading image: ${err.message}`);
        }
    }
    async updateProduct(id, body) {
        try {
            const productExists = await this.prisma.product.findUnique({
                where: { products_id: id },
            });
            if (!productExists) {
                throw new Error(`Product with id ${id} not exits!`);
            }
            const product = await this.prisma.product.update({
                where: {
                    products_id: id,
                },
                data: body,
            });
            return { product };
        }
        catch { }
    }
    async deleteProduct(id) {
        try {
            const product = await this.prisma.product.delete({
                where: {
                    products_id: id,
                },
            });
            return {
                message: 'Order deleted successfully!',
                product,
            };
        }
        catch { }
    }
    async deleteCommentById(commentId, userId) {
        try {
            const comment = await this.prisma.productComment.findUnique({
                where: {
                    comment_id: commentId,
                },
            });
            if (!comment) {
                throw new Error("Comment not found.");
            }
            if (comment.user_id !== userId) {
                throw new Error("You are not authorized to delete this comment.");
            }
            const deletedComment = await this.prisma.productComment.delete({
                where: {
                    comment_id: commentId,
                },
            });
            return { message: "Comment deleted successfully!", deletedComment };
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)()
], ProductService);
//# sourceMappingURL=product.service.js.map