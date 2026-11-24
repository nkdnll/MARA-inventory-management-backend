
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  Repository,
} from 'typeorm';

import { Material } from '../materials/material.entity';
import { Employee } from '../employees/employee.entity';

import {
  StockTransaction,
  StockTransactionType,
} from './stock-transaction.entity';

import {
  CreateStockTransactionDto,
} from './dto/create-stock-transaction.dto';

@Injectable()
export class StockTransactionsService {
  constructor(
    private readonly dataSource: DataSource,

    @InjectRepository(StockTransaction)
    private readonly transactionRepository:
      Repository<StockTransaction>,
  ) {}

  async create(dto: CreateStockTransactionDto) {
    return this.dataSource.transaction(async (manager) => {
      const materialRepository =
        manager.getRepository(Material);

      const employeeRepository =
        manager.getRepository(Employee);

      const transactionRepository =
        manager.getRepository(StockTransaction);

      // Lock this material while its quantity is updated.
      const material = await materialRepository.findOne({
        where: { materialId: dto.materialId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!material) {
        throw new NotFoundException(
          `Material ${dto.materialId} not found`,
        );
      }

      const employee = await employeeRepository.findOneBy({
        employeeId: dto.employeeId,
      });

      if (!employee) {
        throw new NotFoundException(
          `Employee ${dto.employeeId} not found`,
        );
      }

      const quantityBefore = material.quantity;

      let quantityAfter: number;

      if (dto.transactionType === StockTransactionType.IN) {
        quantityAfter = quantityBefore + dto.quantity;
      } else if (
        dto.transactionType === StockTransactionType.OUT
      ) {
        if (dto.quantity > quantityBefore) {
          throw new BadRequestException(
            'Insufficient stock available',
          );
        }

        quantityAfter = quantityBefore - dto.quantity;
      } else {
        throw new BadRequestException(
          'Invalid transaction type',
        );
      }

      if (!Number.isSafeInteger(quantityAfter)) {
        throw new BadRequestException(
          'Stock quantity exceeds the supported limit',
        );
      }

      // Update the current material quantity.
      material.quantity = quantityAfter;

      if (quantityAfter === 0) {
        material.status = 'Out of Stock';
      } else {
        material.status = 'Available';
      }

      await materialRepository.save(material);

      // Record the transaction in the same database transaction.
      const transaction = transactionRepository.create({
        materialId: dto.materialId,
        employeeId: dto.employeeId,
        transactionType: dto.transactionType,
        quantity: dto.quantity,
        quantityBefore,
        quantityAfter,
        remarks: dto.remarks ?? null,
      });

      return transactionRepository.save(transaction);
    });
  }

  async findAll() {
    return this.transactionRepository.find({
      relations: {
        material: true,
        employee: true,
      },
      order: {
        transactionId: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { transactionId: id },
      relations: {
        material: true,
        employee: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException(
        `Stock transaction ${id} not found`,
      );
    }

    return transaction;
  }

  async findByMaterial(materialId: number) {
    const material = await this.dataSource
      .getRepository(Material)
      .findOneBy({ materialId });

    if (!material) {
      throw new NotFoundException(
        `Material ${materialId} not found`,
      );
    }

    return this.transactionRepository.find({
      where: { materialId },
      relations: {
        material: true,
        employee: true,
      },
      order: {
        transactionId: 'DESC',
      },
    });
  }
}
