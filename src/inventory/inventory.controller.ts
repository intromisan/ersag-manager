import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards';
import { AddProductDto } from './dto';
import { Inventory } from './entities';
import { InventoryService } from './inventory.service';

@Controller('inventory')
@UseGuards(JwtGuard)
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Post('/inventoryItem')
  addInventoryItem(@Body() addProductDto: AddProductDto) {
    this.inventoryService.addProductToInventory(addProductDto);
  }

  @Get()
  getInventory(): Promise<Inventory[]> {
    return this.inventoryService.getInventory();
  }
}
