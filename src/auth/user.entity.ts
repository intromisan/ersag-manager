import { Inventory } from 'src/inventory/entities';
import { IInventory } from 'src/inventory/interfaces';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToOne(() => Inventory)
  @JoinColumn({ referencedColumnName: 'id' })
  inventory: IInventory;
}
