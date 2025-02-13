import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { signInDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { EntityNotFoundError } from 'src/errors/entityNotFound.error';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) { }

  async signIn({ email, password }: signInDto) {
    const user = await this.prisma.user.findFirst({ where: { email } });

    if (!user) {
      throw new EntityNotFoundError('User');
    }

    const passComparison = await bcrypt.compare(password, user.password).catch(() => {
      throw new EntityNotFoundError('User');
    });


    if (!passComparison) {
      throw new EntityNotFoundError('User');
    }
    const userData = {
      email: user.email,
      id: user.id,
      username: user.username,
    };

    const token = await this.jwtService.signAsync(userData);

    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
    };


    return { ...payload, statusCode: 200, token };
  }
}
