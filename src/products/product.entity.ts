import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { VolumeUnit } from './interfaces';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  code: string;

  @Column()
  volume: number;

  @Column({
    type: 'enum',
    enum: VolumeUnit,
    default: VolumeUnit.ML,
  })
  volumeUnit: VolumeUnit;

  @Column()
  price: number;

  @Column('boolean', {
    default: false,
  })
  withDevice: boolean = false;

  @Column()
  image: string;
}
