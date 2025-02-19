import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from '../../db/prisma.service';
import * as bcrypt from 'bcrypt';
import { EntityAlreadyExistsError } from 'src/errors/entityAlreadyExists.error';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateUserDTO) {
    const userExists = await this.prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });
    if (userExists) {
      throw new EntityAlreadyExistsError("User")
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
      },
    });
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    return payload;
  }

}
