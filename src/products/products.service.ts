import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { EditProductDto } from './dto/edit-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { ProductEntity } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  async getProducts(filterDto: GetProductsFilterDto): Promise<ProductEntity[]> {
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

  async getProductById(id: string): Promise<ProductEntity> {
    const product = await this.productRepository.findOneBy({ id });

    if (!product)
      throw new NotFoundException(`Product with ID ${id} not found`);

    return product;
  }

  async createProduct(createProductDto: CreateProductDto): Promise<void> {
    const product = this.productRepository.create({ ...createProductDto });

    try {
      await this.productRepository.save(product);
    } catch (error) {
      switch (error.code) {
        case '23505':
          throw new ConflictException(
            `Product with code: ${createProductDto.code} already exists`,
          );
        case '23502':
          throw new BadRequestException();

        default:
          throw new InternalServerErrorException();
      }
    }
  }

  async changeProduct(
    id: string,
    editProductDto: EditProductDto,
  ): Promise<void> {
    try {
      await this.productRepository.update({ id }, { ...editProductDto });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
