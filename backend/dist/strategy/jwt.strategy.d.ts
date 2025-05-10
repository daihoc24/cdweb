import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor(config: ConfigService);
    prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
    validate(tokenDecode: any): Promise<boolean>;
}
export {};
