import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { PostService } from './post.service';
import { JwtGuard, RolesGuard } from '../auth/guard';
import { RoleEnum } from '../enums';
import { GetUser, Roles } from '../auth/decorator';
import { CreatePostDto } from './dto';
import { GetPostsDto } from './dto';
import { ParseOptionalIntPipe } from '../pipes/parseOptionalInt.pipe';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleEnum.USER)
  @Post()
  createPost(@Body() dto: CreatePostDto, @GetUser('id') userId: number) {
    return this.postService.createPost({
      ownerId: userId,
      postDto: dto,
    });
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Get()
  getAll(
    @Body() dto: GetPostsDto,
    @Query('page', ParseOptionalIntPipe) page?: number,
    @Query('limit', ParseOptionalIntPipe) limit?: number,
  ) {
    return this.postService.getAll({ dto, page, limit });
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleEnum.USER)
  @Get('my')
  getMy(
    @GetUser('id') userId: number,
    @Body() dto: GetPostsDto,
    @Query('page', ParseOptionalIntPipe) page?: number,
    @Query('limit', ParseOptionalIntPipe) limit?: number,
  ) {
    return this.postService.getMy({ userId, dto, page, limit });
  }

  @Get('published')
  getPublished(
    @Body() dto: GetPostsDto,
    @Query('page', ParseOptionalIntPipe) page?: number,
    @Query('limit', ParseOptionalIntPipe) limit?: number,
  ) {
    return this.postService.getPublished({ dto, page, limit });
  }
}
