import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  volume: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsBoolean()
  withDevice: boolean;

  @IsString()
  image: string;
}
