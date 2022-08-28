import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators';
import { JwtGuard } from 'src/auth/guards';
import { CalculationToBalanceDto } from './dto';
import { UserEntity } from './entities';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/balance')
  getUserBalance(@GetUser() user: UserEntity): { userBalance: number } {
    return this.userService.getUserBalance(user);
  }
}
