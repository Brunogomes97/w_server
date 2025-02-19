import { Injectable } from '@nestjs/common';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';
import { UserRequest } from 'src/types/HttpRequest';
import { PrismaService } from '../../db/prisma.service';
import { FindAllQueryDto } from './dto/get-notas.dto';
import { EntityNotFoundError } from 'src/errors/entityNotFound.error';
import { Nota } from './entities/nota.entity';
import { FindAllResponse } from 'src/types/querys';

@Injectable()
export class NotasService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateNotaDto, user: UserRequest) {
    const nota = await this.prisma.notas.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        user: {
          connect: {
            id: user.id
          }
        }
      }
    })
    const payload = {
      id: nota.id,
      title: nota.title,
      description: nota.description,
      type: nota.type,
      iat: Date.now(),
    }
    return payload;
  }

  async findAll(queries: FindAllQueryDto, user: UserRequest): Promise<FindAllResponse> {
    const { offset = 0, limit = 10, type, search, order } = queries;
    const where = {};

    const typeOrder = order === 'asc' ? 'asc' : 'desc';

    if (search) {
      where['title'] = {
        contains: search,
        mode: 'insensitive', // case insensitive
      };
    }

    const notas: Nota[] = await this.prisma.notas.findMany({
      where: {
        ...where,
        type,
        user: {
          id: user.id
        }
      },
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: typeOrder
      }
    })

    const total = await this.prisma.notas.count({
      where: {
        ...where,
        user: {
          id: user.id
        }
      }
    })

    const payload = {
      data: notas,
      total_items: total,
      offset,
      limit,
      search,
      iat: Date.now(),
    }
    return payload
  }

  async findOne(id: string, user: UserRequest) {
    return await this.prisma.notas.findFirst({
      where: {
        id, user: {
          id: user.id
        }
      },
    });
  }

  async update(id: string, data: UpdateNotaDto, user: UserRequest) {
    const thisNota = await this.findOne(id, user);

    if (!thisNota) {
      throw new EntityNotFoundError('Nota');
    }
    return await this.prisma.notas.update({
      where: {
        id
      },
      data
    })
  }

  async remove(id: string, user: UserRequest) {
    const thisNota = await this.findOne(id, user);

    if (!thisNota) {
      throw new EntityNotFoundError('Nota');
    }

    return await this.prisma.notas.delete({
      where: {
        id
      }
    })
  }

  async removeMany(ids: string[], user: UserRequest) {
    const verifyAllNotas = await this.prisma.notas.findMany({
      where: {
        id: {
          in: ids
        },
        user: {
          id: user.id
        }
      }
    })

    if (verifyAllNotas.length !== ids.length) {
      throw new EntityNotFoundError('Nota');
    }

    return await this.prisma.notas.deleteMany({
      where: {
        id: {
          in: ids
        },
        user: {
          id: user.id
        }
      }
    })
  }
}
