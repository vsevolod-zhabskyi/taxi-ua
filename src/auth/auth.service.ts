import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import { RoleEnum } from '../enums';
import { UserJwt } from '../types';

@Injectable()
export class AuthService {
  SALT = Number(process.env.PASSWORD_SALT);

  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async login(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: dto.username,
      },
      include: {
        roles: {
          select: { role: true },
        },
      },
    });

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);
    }

    const roles = user.roles.map(({ role }) => role.name);

    const token = await this.signToken({
      id: user.id,
      username: user.username,
      roles,
    });

    return {
      access_token: token,
    };
  }

  async register(dto: AuthDto) {
    const candidate = await this.prisma.user.findUnique({
      where: {
        username: dto.username,
      },
    });

    if (candidate) {
      throw new HttpException(
        'Username is already used',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword = await bcrypt.hash(dto.password, this.SALT);

    const user = await this.prisma.user.create({
      data: {
        ...dto,
        password: hashPassword,
        roles: {
          create: [{ role: { connect: { id: Number(RoleEnum.USER_ID) } } }],
        },
      },
      include: {
        roles: {
          select: { role: true },
        },
      },
    });

    delete user.password;

    return user;
  }

  signToken({ id, username, roles }: UserJwt): Promise<string> {
    return this.jwt.signAsync(
      {
        id,
        username,
        roles,
      },
      {
        expiresIn: '24h',
        secret: process.env.JWT_SECRET,
      },
    );
  }
}
