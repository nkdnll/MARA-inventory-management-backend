
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import {
  StockTransactionsService,
} from './stock-transactions.service';

import {
  CreateStockTransactionDto,
} from './dto/create-stock-transaction.dto';

@Controller('stock-transactions')
export class StockTransactionsController {
  constructor(
    private readonly stockTransactionsService:
      StockTransactionsService,
  ) {}

  @Post()
  create(@Body() dto: CreateStockTransactionDto) {
    return this.stockTransactionsService.create(dto);
  }

  @Get()
  findAll() {
    return this.stockTransactionsService.findAll();
  }

  @Get('material/:materialId')
  findByMaterial(
    @Param('materialId', ParseIntPipe) materialId: number,
  ) {
    return this.stockTransactionsService.findByMaterial(
      materialId,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.stockTransactionsService.findOne(id);
  }
}
