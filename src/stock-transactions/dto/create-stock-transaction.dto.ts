
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

import {
  StockTransactionType,
} from '../stock-transaction.entity';

export class CreateStockTransactionDto {
  @IsInt()
  @Min(1)
  materialId: number;

  @IsInt()
  @Min(1)
  employeeId: number;

  @IsEnum(StockTransactionType)
  transactionType: StockTransactionType;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  remarks?: string | null;
}
