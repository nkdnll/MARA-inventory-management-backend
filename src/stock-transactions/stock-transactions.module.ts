
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StockTransaction } from './stock-transaction.entity';

import {
  StockTransactionsController,
} from './stock-transactions.controller';

import {
  StockTransactionsService,
} from './stock-transactions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockTransaction]),
  ],
  controllers: [StockTransactionsController],
  providers: [StockTransactionsService],
})
export class StockTransactionsModule {}
