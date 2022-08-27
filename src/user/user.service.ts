import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAll({ page, limit }: { page?: number; limit?: number }) {
    return this.prisma.user.findMany({
      skip: (page - 1) * limit || undefined,
      take: limit,
    });
  }
}
