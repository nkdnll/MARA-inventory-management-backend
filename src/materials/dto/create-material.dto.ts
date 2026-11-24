
import {
  IsInt,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateMaterialDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  materialName: string;

  @IsInt()
  @Min(1)
  categoryId: number;

  @IsInt()
  @Min(1)
  supplierId: number;

  @IsInt()
  @Min(0)
  quantity: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  unit: string;

  @IsOptional()
  @IsIn(['Available', 'Low Stock', 'Out of Stock'])
  status?: string;
}
