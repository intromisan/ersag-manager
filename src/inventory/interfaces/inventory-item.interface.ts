import { IProduct } from 'src/products/interfaces';

export interface IInventoryItem {
  quantity: number;
  product: IProduct;
}
