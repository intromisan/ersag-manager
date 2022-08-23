import { VolumeUnit } from './volume-unit.interface';

export interface IProduct {
  name: string;
  code: string;
  volume: number;
  volumeUnit: VolumeUnit;
  price: number;
  withDevice: boolean;
  image: string;
}
