import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column()
  volume: string;

  @Column()
  price: number;

  @Column('boolean', {
    default: false,
  })
  withDevice: boolean = false;

  @Column()
  image: string;
}
