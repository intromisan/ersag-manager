import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { Product } from './product.entity';
import { ProductsService } from './products.service';

@Controller('products')
@UseGuards(JwtGuard)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  getProducts(@Query() filterDto: GetProductsFilterDto): Promise<Product[]> {
    return this.productsService.getProducts(filterDto);
  }

  @Get(':id')
  getProductById(@Param('id') id: string): Promise<Product> {
    return this.productsService.getProductById(id);
  }
}
