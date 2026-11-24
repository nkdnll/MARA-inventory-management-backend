import { Test, TestingModule } from '@nestjs/testing';
import { InventoryAlertsService } from './inventory-alerts.service';

describe('InventoryAlertsService', () => {
  let service: InventoryAlertsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventoryAlertsService],
    }).compile();

    service = module.get<InventoryAlertsService>(InventoryAlertsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
