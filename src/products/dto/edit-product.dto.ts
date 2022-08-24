import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';
import { VolumeUnit } from '../interfaces';

export class EditProductDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsNumber()
  volume: number;

  @IsEnum(VolumeUnit)
  volumeUnit: VolumeUnit;

  @IsNumber()
  price: number;

  @IsBoolean()
  withDevice: boolean;

  @IsString()
  image: string;
}
