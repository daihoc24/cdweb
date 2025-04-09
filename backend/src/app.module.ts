import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BankAccountsModule } from './bank_accounts/bank_accounts.module';

@Module({
  imports: [AuthModule, BankAccountsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
