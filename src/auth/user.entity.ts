import { Exclude } from 'class-transformer';
import { InventoryEntity } from 'src/inventory/entities';
import { IInventory } from 'src/inventory/interfaces';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
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

  @OneToOne(() => InventoryEntity, { cascade: true, eager: true })
  @JoinColumn({ referencedColumnName: 'id' })
  inventory: IInventory;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
