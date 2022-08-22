import { UserEntity } from 'src/auth/user.entity';
import { IProduct } from 'src/products/interfaces';
import { Product } from 'src/products/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IInventory } from '../interfaces';
import { InventoryEntity } from './inventory.entity';

@Entity('inventoryItems')
export class InventoryItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column()
  quantity: number;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @ManyToOne(() => Product)
  @JoinColumn()
  product: IProduct;

  @ManyToOne(() => InventoryEntity, (inventory) => inventory.products)
  inventory: IInventory;
}
