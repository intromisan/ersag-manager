import { Exclude } from 'class-transformer';
import { InventoryItemEntity } from 'src/inventory/entities';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
  JoinTable,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => InventoryItemEntity, (inventoryItem) => inventoryItem.user)
  @JoinColumn({ name: 'inventory' })
  inventory: InventoryItemEntity[];

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
