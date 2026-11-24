
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { MaterialsService } from './materials.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { Roles } from '../auth/roles.decorator';

@Controller('materials')
export class MaterialsController {
  constructor(
    private readonly materialsService: MaterialsService,
  ) {}

  // ADMIN AND STAFF: Create material
  @Post()
  create(@Body() dto: CreateMaterialDto) {
    return this.materialsService.create(dto);
  }

  // ADMIN AND STAFF: View all materials
  @Get()
  findAll() {
    return this.materialsService.findAll();
  }

  // ADMIN AND STAFF: View material by ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.materialsService.findOne(id);
  }

  // ADMIN AND STAFF: Update material details
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMaterialDto,
  ) {
    return this.materialsService.update(id, dto);
  }

  // ADMIN ONLY: Delete material
  @Roles('admin')
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.materialsService.remove(id);
  }
}
