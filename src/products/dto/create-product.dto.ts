import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { VolumeUnit } from '../interfaces';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsNumber()
  volume: number;

  @IsNotEmpty()
  @IsEnum(VolumeUnit)
  volumeUnit: VolumeUnit;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsBoolean()
  withDevice: boolean = false;

  @IsString()
  image: string;
}
