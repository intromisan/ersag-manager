import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async getProducts(filterDto: GetProductsFilterDto): Promise<Product[]> {
    const { search } = filterDto;
    const query = this.productRepository.createQueryBuilder('product');

    if (search) {
      query.andWhere(
        'LOWER(product.name) LIKE LOWER(:search) OR LOWER(product.code) LIKE LOWER(:search)',
        {
          search: `%${search}%`,
        },
      );
    }

    const tasks = query.getMany();
    return tasks;
  }
}
