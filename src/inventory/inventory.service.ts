import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/auth/user.entity';
import { Product } from 'src/products/product.entity';
import { Repository } from 'typeorm';
import { CreateInventoryItemDto } from './dto';
import { InventoryEntity, InventoryItemEntity } from './entities';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(InventoryItemEntity)
    private inventoryItemRepository: Repository<InventoryItemEntity>,
    @InjectRepository(InventoryEntity)
    private inventoryRepository: Repository<InventoryEntity>,
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
        // console.log('bla');
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    // // Product exists as inventoryItem
    // const exists = await this.inventoryItemRepository.findOne({
    //   where: { product, inventory: userInventory },
    // });

    // try {
    //   if (exists) {
    //     await this.inventoryItemRepository
    //       .createQueryBuilder()
    //       .update(InventoryItemEntity)
    //       .set({ quantity: () => `quantity + ${quantity}` })
    //       .where('productId = :id', { id: product.id })
    //       .execute();
    //   } else {
    //     const inventoryItem = this.inventoryItemRepository.create({
    //       product: product,
    //       quantity: quantity,
    //       inventory: inventory,
    //     });

    //     await this.inventoryItemRepository.save(inventoryItem);

    //     await this.inventoryRepository
    //       .createQueryBuilder()
    //       .relation(InventoryEntity, 'products')
    //       .of(inventory)
    //       .add(inventoryItem);
    //   }

    //   // await this.inventoryRepository.save(inventory);
    // } catch (error) {
    // }
  }

  async getInventory(user: UserEntity): Promise<InventoryEntity> {
    const { inventory: userInventory } = user;
    return await this.inventoryRepository.findOne({
      where: { id: userInventory.id },
    });
  }

  private async createInventoryItem(
    createInventoryItemDto: CreateInventoryItemDto,
    product: Product,
    user: UserEntity,
  ): Promise<InventoryItemEntity> {
    const { quantity } = createInventoryItemDto;
    const { inventory: userInventory } = user;

    const newItem = this.inventoryItemRepository.create({
      product: product,
      quantity: quantity,
      inventory: userInventory,
      user: user,
    });

    try {
      return this.inventoryItemRepository.save(newItem);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async createInventory(): Promise<InventoryEntity> {
    const inventory = this.inventoryRepository.create();
    return await this.inventoryRepository.save(inventory);
  }
}
