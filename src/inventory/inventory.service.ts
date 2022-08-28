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
import { UserService } from 'src/user/user.service';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryItemEntity)
    private inventoryItemRepository: Repository<InventoryItemEntity>,
    private readonly productsService: ProductsService,
    private readonly userService: UserService,
  ) {}

  async addProductToInventory(
    createInventoryItemDto: CreateInventoryItemDto,
    user: UserEntity,
  ): Promise<void> {
    const { productId, quantity, isGift } = createInventoryItemDto;

    // Find product
    const product = await this.productsService.getProductById(productId);

    // Find inventory item
    const item = await this.inventoryItemRepository.findOne({
      where: { product, user },
    });

    const addItemQuery = this.inventoryItemRepository
      .createQueryBuilder()
      .update(InventoryItemEntity)
      .where('userId = :userId', { userId: user.id })
      .andWhere('productId = :id', { id: product.id })
      .set({ quantity: () => `quantity + ${quantity}` });

    try {
      if (item) {
        await addItemQuery.execute();
      } else {
        this.createInventoryItem(createInventoryItemDto, product, user);
      }

      // If not a present, deduct from balance
      if (!isGift)
        await this.userService.deductFromUserBalance(user, product.price);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async removeItemFromInventory(
    removeInventoryItemDto: RemoveInventoryItemDto,
    user: UserEntity,
  ): Promise<void> {
    const { productId, quantity, price, isGift, isDelete } =
      removeInventoryItemDto;
    const { id: userId } = user;

    const item = await this.inventoryItemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.product', 'product')
      .leftJoinAndSelect('item.user', 'user')
      .where('user.id = :id', { id: userId })
      .where('product.id = :id', { id: productId })
      .getOne();

    if (!item) throw new NotFoundException('Item not found in inventory');

    // Removing number of Items or the whole item
    if (item.quantity <= quantity) {
      await this.inventoryItemRepository.remove(item);
    } else {
      await this.inventoryItemRepository
        .createQueryBuilder()
        .update(InventoryItemEntity)
        .where('userId = :userId', { userId: userId })
        .where('productId = :id', { id: productId })
        .set({
          quantity: () => `quantity - ${quantity}`,
        })
        .execute();
    }

    // Calculating Balance
    // If delete we return charged price * quantity
    // If sale we use the provided price * quantity
    // If gifted, we don't modify balance
    try {
      if (isDelete) {
        this.userService.addToUserBalance(user, quantity * item.product.price);
      }
      if (!isDelete && !isGift) {
        this.userService.addToUserBalance(user, quantity * price, true);
      }
    } catch (error) {
      throw new InternalServerErrorException();
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
      .select('SUM(product.price * item.quantity)', 'totalValue')
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
