import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BankAccountsModule } from './bank_accounts/bank_accounts.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { StrategyModule } from './strategy/strategy.module';

@Module({
  imports: [AuthModule, BankAccountsModule, OrderModule, ProductModule, StrategyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
