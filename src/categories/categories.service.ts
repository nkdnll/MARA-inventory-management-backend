
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto) {
    const existing = await this.categoryRepository.findOne({
      where: { categoryName: dto.categoryName },
    });

    if (existing) {
      throw new ConflictException('Category already exists');
    }

    const category = this.categoryRepository.create(dto);

    return this.categoryRepository.save(category);
  }

  async findAll() {
    return this.categoryRepository.find({
      order: { categoryId: 'ASC' },
    });
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { categoryId: id },
    });

    if (!category) {
      throw new NotFoundException(`Category ${id} not found`);
    }

    return category;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    if (
      dto.categoryName &&
      dto.categoryName !== category.categoryName
    ) {
      const existing = await this.categoryRepository.findOne({
        where: { categoryName: dto.categoryName },
      });

      if (existing) {
        throw new ConflictException('Category already exists');
      }
    }

    Object.assign(category, dto);

    return this.categoryRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);

    await this.categoryRepository.remove(category);

    return {
      message: 'Category deleted successfully',
    };
  }
}
