import { UserEntity } from 'src/user/entities';
import { IProduct } from 'src/products/interfaces';
import { ProductEntity } from 'src/products/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('inventoryItems')
export class InventoryItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column()
  quantity: number;

  @ManyToOne(() => UserEntity, (user) => user.inventory)
  user: UserEntity;

  @ManyToOne(() => ProductEntity)
  @JoinColumn()
  product: IProduct;
}
