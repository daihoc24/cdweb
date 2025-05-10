import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService // Inject ConfigService tại đây
  ) { }
  prisma = new PrismaClient();


  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    // Log Authorization header
    console.log('Authorization Header:', authHeader);

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      // Log Token
      console.log('Token:', token);

      try {
        const decoded = this.jwtService.verify(token, {
          secret: this.configService.get('SECRET_KEY'), // Lấy secret key
        });

        // Log SECRET_KEY và decoded token
        console.log('SECRET_KEY:', this.configService.get('SECRET_KEY'));
        console.log('Decoded Token:', decoded);

        const user = await this.prisma.user.findUnique({
          where: {
            user_id: decoded.data.id,
          },
        });

        // Log kết quả truy vấn Prisma
        console.log('Prisma Query Result:', user);

        if (!user) {
          throw new UnauthorizedException('User not found');
        }
        // Gắn thông tin user vào request
        request.user = { ...decoded, role: user.user_role };
        return true;
      } catch (error) {
        // Log lỗi nếu xảy ra
        console.error('JWT Verification Error:', error.message);
        throw new UnauthorizedException('Invalid token');
      }
    }

    throw new UnauthorizedException('Missing or invalid token');
  }
}