import { PaymentService } from './bank_accounts.service';
import { ValidatePaymentDto } from './dto/validatePayment.dto';
import { Response } from 'express';
export declare class BankAccountsController {
    private readonly paymenService;
    constructor(paymenService: PaymentService);
    validatePayment(res: Response, paymentData: ValidatePaymentDto, orderId: string): Promise<void>;
}
