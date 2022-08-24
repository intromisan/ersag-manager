import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { ProductEntity } from './product.entity';
import { ProductsService } from './products.service';

@Controller('products')
@UseGuards(JwtGuard)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  getProducts(
    @Query() filterDto: GetProductsFilterDto,
  ): Promise<ProductEntity[]> {
    return this.productsService.getProducts(filterDto);
  }

  @Get(':id')
  getProductById(@Param('id') id: string): Promise<ProductEntity> {
    return this.productsService.getProductById(id);
  }

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto): Promise<void> {
    return this.productsService.createProduct(createProductDto);
  }
}
