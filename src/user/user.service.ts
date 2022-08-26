import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalculationToBalanceDto, CreateUserDto } from './dto';
import { UserEntity } from './entities';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const { email, hashedPassword } = createUserDto;

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
    });

    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email address already exists');
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  getUserBalance(user: UserEntity): { userBalance: number } {
    return { userBalance: user.balance };
  }

  async addToUserBalance(
    user: UserEntity,
    productPrice: number,
    fullPrice?: boolean,
  ): Promise<void> {
    const { id, discount } = user;

    const discountedPrice = this.getDiscountedPrice(discount, productPrice);

    const addToBalanceQuery = this.userRepository
      .createQueryBuilder('user')
      .update(UserEntity)
      .where('id = :id', { id })
      .set({
        balance: () =>
          `balance + ${fullPrice ? productPrice : discountedPrice}`,
      });

    try {
      await addToBalanceQuery.execute();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deductFromUserBalance(
    user: UserEntity,
    productPrice: number,
  ): Promise<void> {
    const { id, discount } = user;

    const discountedPrice = this.getDiscountedPrice(discount, productPrice);

    const deductFromBalanceQuery = this.userRepository
      .createQueryBuilder('user')
      .update(UserEntity)
      .where('id = :id', { id })
      .set({ balance: () => `balance - ${discountedPrice}` });

    try {
      await deductFromBalanceQuery.execute();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  private getDiscountedPrice(discount: number, productPrice: number): number {
    return productPrice - productPrice * discount;
  }
}
