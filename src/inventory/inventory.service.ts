import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/auth/user.entity';
import { Product } from 'src/products/product.entity';
import { Repository } from 'typeorm';
import { AddProductDto } from './dto/add-product.dto';
import { InventoryEntity, InventoryItemEntity } from './entities';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(InventoryItemEntity)
    private inventoryItemRepository: Repository<InventoryItemEntity>,
    @InjectRepository(InventoryEntity)
    private inventoryRepository: Repository<InventoryEntity>,
  ) {}

  async addProductToInventory(addProductDto: AddProductDto): Promise<any> {
    const { productId, quantity } = addProductDto;
    const user = await this.userRepository.findOne({
      where: {},
      relations: ['inventory'],
    });

    // Find product
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product)
      throw new NotFoundException(`Product with ID: ${productId} not found`);

    // Find inventory
    const inventory = await this.inventoryRepository.findOneBy({
      id: user.inventory.id,
    });
    if (!inventory) throw new InternalServerErrorException();

    // Product exists as inventoryItem
    const exists = await this.inventoryItemRepository.findOneBy({ product });

    try {
      if (exists) {
        await this.inventoryItemRepository
          .createQueryBuilder()
          .update(InventoryItemEntity)
          .set({ quantity: () => `quantity + ${quantity}` })
          .where('productId = :id', { id: product.id })
          .execute();
      } else {
        const inventoryItem = this.inventoryItemRepository.create({
          product: product,
          quantity: quantity,
          inventory: inventory,
        });

        await this.inventoryItemRepository.save(inventoryItem);

        await this.inventoryRepository
          .createQueryBuilder()
          .relation(InventoryEntity, 'products')
          .of(inventory)
          .add(inventoryItem);
      }

      // await this.inventoryRepository.save(inventory);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getInventory(): Promise<InventoryEntity[]> {
    return this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.products', 'inventoryItem')
      .getMany();
  }

  async createInventory(): Promise<InventoryEntity> {
    const inventory = this.inventoryRepository.create();
    return await this.inventoryRepository.save(inventory);
  }
}
