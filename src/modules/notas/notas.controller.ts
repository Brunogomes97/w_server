import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { NotasService } from './notas.service';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AuthRequest } from 'src/types/HttpRequest';
import { FindAllQueryDto } from './dto/get-notas.dto';
@UseGuards(AuthGuard)
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
@Controller('notas')
export class NotasController {
  constructor(private readonly notasService: NotasService) { }

  @Post()
  async create(@Body() data: CreateNotaDto, @Req() req: AuthRequest) {
    try {
      return await this.notasService.create(data, req.user);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll(
    @Query(ValidationPipe) queryDto: FindAllQueryDto,
    @Req() req: AuthRequest,
  ) {
    try {
      return await this.notasService.findAll(queryDto, req.user);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.notasService.findOne(+id);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateNotaDto: UpdateNotaDto) {
    try {
      return await this.notasService.update(+id, updateNotaDto);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.notasService.remove(+id);
    } catch (error) {
      throw error;
    }
  }
}
