import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { ProductEntity } from 'src/products/product.entity';
import { ProductsService } from 'src/products/products.service';
import { Repository } from 'typeorm';
import { CreateInventoryItemDto, RemoveInventoryItemDto } from './dto';
import { InventoryItemEntity } from './entities';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryItemEntity)
    private inventoryItemRepository: Repository<InventoryItemEntity>,
    private readonly productsService: ProductsService,
  ) {}

  async addProductToInventory(
    createInventoryItemDto: CreateInventoryItemDto,
    user: UserEntity,
  ): Promise<any> {
    const { productId, quantity } = createInventoryItemDto;

    // Find product
    const product = await this.productsService.getProductById(productId);

    // Find inventory item
    const item = await this.inventoryItemRepository.findOne({
      where: { product, user },
    });

    try {
      if (item) {
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

  async removeItemFromInventory(
    removeInventoryItemDto: RemoveInventoryItemDto,
    user: UserEntity,
  ) {
    const { productId, quantity } = removeInventoryItemDto;
    const { id: userId } = user;

    const item = await this.inventoryItemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.product', 'product')
      .leftJoinAndSelect('item.user', 'user')
      .where('user.id = :id', { id: userId })
      .where('product.id = :id', { id: productId })
      .getOne();

    if (!item) throw new NotFoundException('Item not found in inventory');

    if (item.quantity <= quantity) {
      return await this.inventoryItemRepository.remove(item);
    } else {
      return await this.inventoryItemRepository
        .createQueryBuilder()
        .update(InventoryItemEntity)
        .where('userId = :userId', { userId: userId })
        .where('productId = :id', { id: productId })
        .set({
          quantity: () => `quantity - ${quantity}`,
        })
        .execute();
    }
  }

  async getInventory(user: UserEntity): Promise<InventoryItemEntity[]> {
    const { id } = user;

    const inventory = await this.inventoryItemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.product', 'product')
      .where('item.userId = :id', { id })
      .getMany();

    return inventory;
  }

  async getInventoryTotalValue(
    user: UserEntity,
  ): Promise<{ totalValue: number }> {
    const { id: userId } = user;
    const totalValue = await this.inventoryItemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.product', 'product')
      .leftJoinAndSelect('item.user', 'user')
      .where('user.id = :id', { id: userId })
      .select('SUM(product.price)', 'totalValue')
      .getRawOne();

    return totalValue;
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
