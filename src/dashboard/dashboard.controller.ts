import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators';
import { JwtGuard } from 'src/auth/guards';
import { UserEntity } from 'src/user/entities';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getDashboardInformation(@GetUser() user: UserEntity) {
    return this.dashboardService.getDashboardInformation(user);
  }
}
