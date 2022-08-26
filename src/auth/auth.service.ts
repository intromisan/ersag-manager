import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-creadentials.dto';
import { UserEntity } from '../user/entities/user.entity';
import { JwtPayload } from './interfaces';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    private userService: UserService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { email, password } = authCredentialsDto;

    // Hash
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    await this.userService.createUser({ email, hashedPassword });
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ access_token: string }> {
    const { email, password } = authCredentialsDto;
    const user = await this.userService.findUserByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      return this.generateToken(user);
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  private async generateToken(user: UserEntity) {
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
