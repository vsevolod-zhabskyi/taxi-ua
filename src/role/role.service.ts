import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async createRole(dto: CreateRoleDto) {
    return this.prisma.role.create({
      data: dto,
    });
  }
}
