
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Material } from '../materials/material.entity';

import {
  InventoryAlertsController,
} from './inventory-alerts.controller';

import {
  InventoryAlertsService,
} from './inventory-alerts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Material]),
  ],
  controllers: [InventoryAlertsController],
  providers: [InventoryAlertsService],
})
export class InventoryAlertsModule {}
