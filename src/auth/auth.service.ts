import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-creadentials.dto';
import { User } from './user.entity';
import { JwtPayload } from './interfaces';
import { ConfigService } from '@nestjs/config';
import { InventoryService } from 'src/inventory/inventory.service';
import { Inventory } from 'src/inventory/entities';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { email, password } = authCredentialsDto;

    // Hash
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const inventory = this.inventoryRepository.create({
      products: [],
    });

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
    });

    user.inventory = inventory;

    try {
      await this.inventoryRepository.save(inventory);
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email address already exists');
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ access_token: string }> {
    const { email, password } = authCredentialsDto;
    const user = await this.userRepository.findOneBy({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      return this.generateToken(user);
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  private async generateToken(user: User) {
    const { email } = user;
    const payload: JwtPayload = { email };
    const secret = this.config.get('JWT_SECRET');
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '1h',
        secret: secret,
      }),
    };
  }
}
