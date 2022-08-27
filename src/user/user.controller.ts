import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';
import { JwtGuard, RolesGuard } from '../auth/guard';
import { Roles } from '../auth/decorator';
import { RoleEnum } from '../enums';
import { ParseOptionalIntPipe } from '../pipes/parseOptionalInt.pipe';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Get()
  getAll(
    @Query('page', ParseOptionalIntPipe) page?: number,
    @Query('limit', ParseOptionalIntPipe) limit?: number,
  ) {
    return this.userService.getAll({ page, limit });
  }
}
