import { IProduct } from 'src/products/interfaces';
import { Product } from 'src/products/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
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

  @OneToOne(() => Product)
  @JoinColumn()
  product: IProduct;

  @ManyToOne(() => InventoryEntity, (inventory) => inventory.products)
  inventory: IInventory;
}
