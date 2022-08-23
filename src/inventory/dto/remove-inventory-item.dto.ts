import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RemoveInventoryItemDto {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNumber()
  quantity: number = 1;
}
