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
  password: string;

  @OneToOne(() => InventoryEntity)
  @JoinColumn({ referencedColumnName: 'id' })
  inventory: IInventory;
}
