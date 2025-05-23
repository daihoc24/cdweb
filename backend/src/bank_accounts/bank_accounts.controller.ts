import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res } from '@nestjs/common';
import { PaymentService } from './bank_accounts.service';
import { ValidatePaymentDto } from './dto/validatePayment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/authGuard';
import { Response } from 'express';

ApiTags('Payment')
@Controller('api/Payment') export class BankAccountsController {
  constructor(private readonly paymenService: PaymentService) { }
  @Post('/validate-payment/:orderId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async validatePayment(@Res() res: Response, @Body() paymentData: ValidatePaymentDto, @Param('orderId') orderId: string) {
    res.send({
      message: 'Xử lí thành công!',
      content: (await this.paymenService.validatePayment(paymentData, +orderId))
    });
  }
}
