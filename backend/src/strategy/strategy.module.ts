import { Module } from '@nestjs/common';
import { StrategyService } from './strategy.service';
import { StrategyController } from './strategy.controller';

@Module({
  controllers: [StrategyController],
  providers: [StrategyService],
})
export class StrategyModule {}
