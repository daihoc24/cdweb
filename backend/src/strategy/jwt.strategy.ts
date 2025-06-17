import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('SECRET_KEY'),
    });
  }
  prisma = new PrismaClient();

  async validate(tokenDecode: any) {
    let { id, user_email} = tokenDecode.data;
    let checkEmail = await this.prisma.user.findFirst({
      where: {
        user_email: user_email,
      },
    });

    if (checkEmail) {
      return true;
    }
    return false;
  }
  // async validate(payload: any) {
  //   const { id, user_email } = payload.data;
  //   const user = await this.prisma.user.findFirst({
  //     where: { user_email: user_email },
  //     select: {
  //       user_id: true,
  //       user_email: true,
  //     },
  //   });

  //   if (!user) {
  //     return null;
  //   }
  //   return user;
  // }
}