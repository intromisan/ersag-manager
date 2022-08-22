import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IInventoryItem } from '../interfaces';
import { InventoryItemEntity } from './inventory-item.entity';

@Entity('inventories')
export class InventoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(
    () => InventoryItemEntity,
    (inventoryItem) => inventoryItem.inventory,
    {
      eager: true,
    },
  )
  products: IInventoryItem[];

  totalInventory: number;
}
