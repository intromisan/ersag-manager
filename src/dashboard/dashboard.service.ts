import { Injectable } from '@nestjs/common';
import { InventoryService } from 'src/inventory/inventory.service';
import { UserEntity } from 'src/user/entities';
import { IDashboardInformation } from './interface';

@Injectable()
export class DashboardService {
  constructor(private readonly inventoryService: InventoryService) {}

  async getDashboardInformation(
    user: UserEntity,
  ): Promise<IDashboardInformation> {
    const inventoryTotalValue =
      await this.inventoryService.getInventoryTotalValue(user);

    const { totalValue } = inventoryTotalValue;

    const result = {
      inventoryTotalValue: Number(totalValue),
      userBalance: Number(user.balance),
      userDiscount: Number(user.discount),
    };

    return result;
  }
}
