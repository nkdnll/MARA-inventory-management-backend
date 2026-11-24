
import {
  Controller,
  Get,
} from '@nestjs/common';

import {
  InventoryAlertsService,
} from './inventory-alerts.service';

@Controller('inventory-alerts')
export class InventoryAlertsController {
  constructor(
    private readonly inventoryAlertsService:
      InventoryAlertsService,
  ) {}

  @Get()
  findAll() {
    return this.inventoryAlertsService.findAll();
  }

  @Get('low-stock')
  findLowStock() {
    return this.inventoryAlertsService.findLowStock();
  }

  @Get('out-of-stock')
  findOutOfStock() {
    return this.inventoryAlertsService.findOutOfStock();
  }
}
