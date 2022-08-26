import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { ProductEntity } from 'src/products/product.entity';
import { ProductsModule } from 'src/products/products.module';
import { InventoryItemEntity } from './entities';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InventoryItemEntity, UserEntity, ProductEntity]),
    ProductsModule,
    UserModule,
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
