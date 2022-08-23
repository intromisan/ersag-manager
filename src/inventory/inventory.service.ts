import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/auth/user.entity';
import { ProductEntity } from 'src/products/product.entity';
import { Repository } from 'typeorm';
import { CreateInventoryItemDto } from './dto';
import { InventoryItemEntity } from './entities';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(InventoryItemEntity)
    private inventoryItemRepository: Repository<InventoryItemEntity>,
  ) {}

  async addProductToInventory(
    createInventoryItemDto: CreateInventoryItemDto,
    user: UserEntity,
  ): Promise<any> {
    const { productId, quantity } = createInventoryItemDto;

    // Find product
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product)
      throw new NotFoundException(`Product with ID: ${productId} not found`);

    const itemExists = await this.inventoryItemRepository.findOne({
      where: { product, user },
    });

    try {
      if (itemExists) {
        return await this.inventoryItemRepository
          .createQueryBuilder()
          .update(InventoryItemEntity)
          .set({ quantity: () => `quantity + ${quantity}` })
          .where('productId = :id', { id: product.id })
          .andWhere('userId = :userId', { userId: user.id })
          .execute();
      } else {
        this.createInventoryItem(createInventoryItemDto, product, user);
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getInventory(user: UserEntity): Promise<any> {
    const { id } = user;

    const inventory = this.inventoryItemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.product', 'product')
      .where('item.userId = :id', { id })
      .getMany();

    return inventory;
  }

  private async createInventoryItem(
    createInventoryItemDto: CreateInventoryItemDto,
    product: ProductEntity,
    user: UserEntity,
  ): Promise<InventoryItemEntity> {
    const { quantity } = createInventoryItemDto;

    const newItem = this.inventoryItemRepository.create({
      product: product,
      quantity: quantity,
      user: user,
    });

    try {
      return this.inventoryItemRepository.save(newItem);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
