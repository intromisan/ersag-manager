import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class AddProductDto {
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @IsNumber()
  quantity: number = 1;
}
