
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  supplierName: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  contactNumber?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  address?: string | null;
}
