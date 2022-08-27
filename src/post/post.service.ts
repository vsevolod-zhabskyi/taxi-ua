import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto';
import { GetPostsDto } from './dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async getAll({
    dto,
    page,
    limit,
  }: {
    dto: GetPostsDto;
    page?: number;
    limit?: number;
  }) {
    return this.prisma.post.findMany({
      where: {
        ownerId: dto.userId,
        published: dto.published,
        name: { contains: dto.name },
      },
      skip: (page - 1) * limit || undefined,
      take: limit,
    });
  }

  async getMy({
    userId,
    dto,
    page,
    limit,
  }: {
    userId: number;
    dto: GetPostsDto;
    page?: number;
    limit?: number;
  }) {
    return this.prisma.post.findMany({
      where: {
        ownerId: userId,
        published: dto.published,
        name: { contains: dto.name },
      },
      skip: (page - 1) * limit || undefined,
      take: limit,
    });
  }

  async getPublished({
    dto,
    page,
    limit,
  }: {
    dto: GetPostsDto;
    page?: number;
    limit?: number;
  }) {
    return this.prisma.post.findMany({
      where: {
        published: true,
        ownerId: dto.userId,
        name: { contains: dto.name },
      },
      skip: (page - 1) * limit || undefined,
      take: limit,
    });
  }

  async createPost({
    ownerId,
    postDto,
  }: {
    ownerId: number;
    postDto: CreatePostDto;
  }) {
    return this.prisma.post.create({
      data: {
        ...postDto,
        ownerId,
      },
    });
  }
}
