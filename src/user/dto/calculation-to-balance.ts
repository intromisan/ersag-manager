import { IsNotEmpty, IsNumber } from 'class-validator';

export class CalculationToBalanceDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
