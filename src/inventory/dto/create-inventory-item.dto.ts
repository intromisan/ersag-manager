import { IsBoolean, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateInventoryItemDto {
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @IsNumber()
  quantity: number = 1;

  @IsBoolean()
  isGift: boolean = false;
}
