import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators';
import { JwtGuard } from 'src/auth/guards';
import { UserEntity } from 'src/user/entities/user.entity';
import { CreateInventoryItemDto, RemoveInventoryItemDto } from './dto';
import { InventoryItemEntity } from './entities';
import { InventoryService } from './inventory.service';

@Controller('inventoryItem')
@UseGuards(JwtGuard)
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Post('/add')
  addInventoryItem(
    @Body() createInventoryItemDto: CreateInventoryItemDto,
    @GetUser() user: UserEntity,
  ): Promise<void> {
    return this.inventoryService.addProductToInventory(
      createInventoryItemDto,
      user,
    );
  }

  @Post('/remove')
  removeInventoryItem(
    @Body() removeInventoryItemDto: RemoveInventoryItemDto,
    @GetUser() user: UserEntity,
  ): Promise<void> {
    return this.inventoryService.removeItemFromInventory(
      removeInventoryItemDto,
      user,
    );
  }

  @Get()
  getInventory(@GetUser() user: UserEntity): Promise<InventoryItemEntity[]> {
    return this.inventoryService.getInventory(user);
  }
}
