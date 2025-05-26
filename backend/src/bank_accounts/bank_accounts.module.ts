import { Module } from '@nestjs/common';
import { BankAccountsController } from './bank_accounts.controller';
import { PaymentService } from './bank_accounts.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule, JwtModule.register({})],
  controllers: [BankAccountsController],
  providers: [PaymentService],
})
export class BankAccountsModule {}
