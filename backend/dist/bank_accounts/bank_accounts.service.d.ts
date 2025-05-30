import { ValidatePaymentDto } from './dto/validatePayment.dto';
import { PrismaClient } from '@prisma/client';
export declare class PaymentService {
    prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
    validatePayment(paymentData: ValidatePaymentDto, orderID: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
