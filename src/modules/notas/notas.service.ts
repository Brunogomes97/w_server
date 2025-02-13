import { Injectable } from '@nestjs/common';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';
import { UserRequest } from 'src/types/HttpRequest';
import { PrismaService } from 'src/db/prisma.service';
import { FindAllQueryDto } from './dto/get-notas.dto';

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

  async findAll(queries: FindAllQueryDto, user: UserRequest) {
    const { offset = 0, limit = 10, search } = queries;
    const where = {};

    if (search) {
      where['title'] = {
        contains: search,
        mode: 'insensitive', // case insensitive
      };
    }

    const notas = await this.prisma.notas.findMany({
      where: {
        ...where,
        user: {
          id: user.id
        }
      },
      skip: offset,
      take: limit,
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

  async findOne(id: number) {
    return `This action returns a #${id} nota`;
  }

  async update(id: number, updateNotaDto: UpdateNotaDto) {
    return `This action updates a #${id} nota`;
  }

  async remove(id: number) {
    return `This action removes a #${id} nota`;
  }
}
