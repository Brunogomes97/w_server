import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { NotasService } from './notas.service';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AuthRequest } from 'src/types/HttpRequest';
import { FindAllQueryDto } from './dto/get-notas.dto';
import { FindNotas, FindOneNotaParams } from './dto/find-notas.dto';

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
  async findOne(@Param() params: FindOneNotaParams, @Req() req: AuthRequest) {
    try {
      return await this.notasService.findOne(params.id, req.user);
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param() params: FindOneNotaParams,
    @Body() data: UpdateNotaDto,
    @Req() req: AuthRequest,
  ) {
    try {
      return await this.notasService.update(params.id, data, req.user);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(
    @Param() params: FindOneNotaParams,
    @Req() req: AuthRequest,
  ) {
    try {
      return await this.notasService.remove(params.id, req.user);
    } catch (error) {
      throw error;
    }
  }

  @Delete()
  async removeMany(
    @Body() data: FindNotas,
    @Req() req: AuthRequest) {
    try {
      return await this.notasService.removeMany(data.ids, req.user);
    } catch (error) {
      throw error;
    }
  }
}
