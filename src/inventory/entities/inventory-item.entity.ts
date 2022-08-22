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
import { Inventory } from './inventory.entity';

@Entity()
export class InventoryItem {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column()
  quantity: number;

  @OneToOne(() => Product)
  @JoinColumn()
  product: IProduct;

  @ManyToOne(() => Inventory, (inventory) => inventory.products)
  inventory: IInventory;
}
