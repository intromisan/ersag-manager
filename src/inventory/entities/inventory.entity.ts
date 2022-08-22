import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IInventoryItem } from '../interfaces';
import { InventoryItem } from './inventory-item.entity';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => InventoryItem, (inventoryItem) => inventoryItem.inventory, {
    eager: true,
  })
  products: IInventoryItem[];

  totalInventory: number;
}
