import {
  IsEmail,
  MinLength,
  IsString,
  IsNotEmpty,
  ArrayContains,
  IsObject,
} from 'class-validator';
import { IInventory } from 'src/inventory/interfaces';

export class AuthCredentialsDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @IsObject()
  inventory: IInventory;
}
