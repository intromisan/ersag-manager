import { IInventoryItem } from './inventory-item.interface';

export interface IInventory {
  id: string;
  products: IInventoryItem[];
}
