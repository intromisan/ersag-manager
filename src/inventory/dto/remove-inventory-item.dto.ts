import {
  IsBoolean,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class RemoveInventoryItemDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNumber()
  quantity: number = 1;

  @IsBoolean()
  isGift: boolean = false;

  @IsBoolean()
  isDelete: boolean = false;

  @IsNumber()
  price: number;
}
