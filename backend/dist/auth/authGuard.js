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
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const client_1 = require("@prisma/client");
let JwtAuthGuard = class JwtAuthGuard {
    jwtService;
    configService;
    constructor(jwtService, configService) {
        this.jwtService = jwtService;
        this.configService = configService;
    }
    prisma = new client_1.PrismaClient();
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        console.log('Authorization Header:', authHeader);
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            console.log('Token:', token);
            try {
                const decoded = this.jwtService.verify(token, {
                    secret: this.configService.get('SECRET_KEY'),
                });
                console.log('SECRET_KEY:', this.configService.get('SECRET_KEY'));
                console.log('Decoded Token:', decoded);
                const user = await this.prisma.user.findUnique({
                    where: {
                        user_id: decoded.data.id,
                    },
                });
                console.log('Prisma Query Result:', user);
                if (!user) {
                    throw new common_1.UnauthorizedException('User not found');
                }
                request.user = { ...decoded, role: user.user_role };
                return true;
            }
            catch (error) {
                console.error('JWT Verification Error:', error.message);
                throw new common_1.UnauthorizedException('Invalid token');
            }
        }
        throw new common_1.UnauthorizedException('Missing or invalid token');
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService, config_1.ConfigService])
], JwtAuthGuard);
//# sourceMappingURL=authGuard.js.map