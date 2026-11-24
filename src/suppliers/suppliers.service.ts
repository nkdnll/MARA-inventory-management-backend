
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Supplier } from './supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  async create(dto: CreateSupplierDto) {
    const supplier = this.supplierRepository.create(dto);
    return this.supplierRepository.save(supplier);
  }

  async findAll() {
    return this.supplierRepository.find({
      order: { supplierId: 'ASC' },
    });
  }

  async findOne(id: number) {
    const supplier = await this.supplierRepository.findOne({
      where: { supplierId: id },
    });

    if (!supplier) {
      throw new NotFoundException(`Supplier ${id} not found`);
    }

    return supplier;
  }

  async update(id: number, dto: UpdateSupplierDto) {
    const supplier = await this.findOne(id);

    Object.assign(supplier, dto);

    return this.supplierRepository.save(supplier);
  }

  async remove(id: number) {
    const supplier = await this.findOne(id);

    await this.supplierRepository.remove(supplier);

    return {
      message: 'Supplier deleted successfully',
    };
  }
}
