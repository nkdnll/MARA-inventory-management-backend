
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Material } from './material.entity';
import { Category } from '../categories/category.entity';
import { Supplier } from '../suppliers/supplier.entity';

import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  private async validateReferences(
    categoryId: number,
    supplierId: number,
  ) {
    const category = await this.categoryRepository.findOneBy({
      categoryId,
    });

    if (!category) {
      throw new BadRequestException(
        `Category ${categoryId} does not exist`,
      );
    }

    const supplier = await this.supplierRepository.findOneBy({
      supplierId,
    });

    if (!supplier) {
      throw new BadRequestException(
        `Supplier ${supplierId} does not exist`,
      );
    }
  }

  async create(dto: CreateMaterialDto) {
    await this.validateReferences(
      dto.categoryId,
      dto.supplierId,
    );

    const material = this.materialRepository.create(dto);

    return this.materialRepository.save(material);
  }

  async findAll() {
    return this.materialRepository.find({
      relations: {
        category: true,
        supplier: true,
      },
      order: { materialId: 'ASC' },
    });
  }

  async findOne(id: number) {
    const material = await this.materialRepository.findOne({
      where: { materialId: id },
      relations: {
        category: true,
        supplier: true,
      },
    });

    if (!material) {
      throw new NotFoundException(
        `Material ${id} not found`,
      );
    }

    return material;
  }

  async update(id: number, dto: UpdateMaterialDto) {
    const material = await this.findOne(id);

    await this.validateReferences(
      dto.categoryId ?? material.categoryId,
      dto.supplierId ?? material.supplierId,
    );

    Object.assign(material, dto);

    return this.materialRepository.save(material);
  }

  async remove(id: number) {
    const material = await this.findOne(id);

    await this.materialRepository.remove(material);

    return {
      message: 'Material deleted successfully',
    };
  }
}

