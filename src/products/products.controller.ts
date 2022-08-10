import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards';
import { ProductsService } from './products.service';

@Controller('products')
@UseGuards(JwtGuard)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  getProducts() {
    return { msg: 'Works' };
  }
}
