
import {
  Injectable,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThan } from 'typeorm';

import { Material } from '../materials/material.entity';

@Injectable()
export class InventoryAlertsService {
  private readonly LOW_STOCK_THRESHOLD = 10;

  constructor(
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
  ) {}

  private getStatus(quantity: number): string {
    if (quantity === 0) {
      return 'Out of Stock';
    }

    if (quantity <= this.LOW_STOCK_THRESHOLD) {
      return 'Low Stock';
    }

    return 'Available';
  }

  async findAll() {
    const materials = await this.materialRepository.find({
      relations: {
        category: true,
        supplier: true,
      },
      order: {
        materialId: 'ASC',
      },
    });

    return materials.map((material) => ({
      materialId: material.materialId,
      materialName: material.materialName,
      categoryId: material.categoryId,
      supplierId: material.supplierId,
      quantity: material.quantity,
      unit: material.unit,
      status: this.getStatus(material.quantity),
      threshold: this.LOW_STOCK_THRESHOLD,
    }));
  }

  async findLowStock() {
    const materials = await this.materialRepository.find({
      where: {
        quantity: LessThanOrEqual(this.LOW_STOCK_THRESHOLD),
      },
      order: {
        quantity: 'ASC',
      },
    });

    return materials
      .filter((material) => material.quantity > 0)
      .map((material) => ({
        materialId: material.materialId,
        materialName: material.materialName,
        quantity: material.quantity,
        unit: material.unit,
        status: 'Low Stock',
        message: 'Material needs replenishment',
      }));
  }

  async findOutOfStock() {
    const materials = await this.materialRepository.find({
      where: {
        quantity: 0,
      },
      order: {
        materialId: 'ASC',
      },
    });

    return materials.map((material) => ({
      materialId: material.materialId,
      materialName: material.materialName,
      quantity: material.quantity,
      unit: material.unit,
      status: 'Out of Stock',
      message: 'Material is currently unavailable',
    }));
  }
}
