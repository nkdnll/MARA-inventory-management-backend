import { Test, TestingModule } from '@nestjs/testing';
import { InventoryAlertsController } from './inventory-alerts.controller';

describe('InventoryAlertsController', () => {
  let controller: InventoryAlertsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryAlertsController],
    }).compile();

    controller = module.get<InventoryAlertsController>(InventoryAlertsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
