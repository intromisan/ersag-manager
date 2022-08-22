import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators';
import { JwtGuard } from 'src/auth/guards';
import { UserEntity } from 'src/auth/user.entity';
import { CreateInventoryItemDto } from './dto';
import { InventoryEntity } from './entities';
import { InventoryService } from './inventory.service';

@Controller('inventory')
@UseGuards(JwtGuard)
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Post('/inventoryItem')
  addInventoryItem(
    @Body() createInventoryItemDto: CreateInventoryItemDto,
    @GetUser() user: UserEntity,
  ) {
    this.inventoryService.addProductToInventory(createInventoryItemDto, user);
  }

  @Get()
  getInventory(@GetUser() user: UserEntity): Promise<InventoryEntity> {
    return this.inventoryService.getInventory(user);
  }
}
