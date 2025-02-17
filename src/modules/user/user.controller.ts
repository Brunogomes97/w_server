import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseFilters,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { EntityAlreadyExistsFilter } from 'src/filters/entityAlreadyExists.filter';

@UseFilters(EntityAlreadyExistsFilter)
@UsePipes(new ValidationPipe({ transform: true }))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }
  @Post()
  async create(@Body() data: CreateUserDTO) {
    try {
      return await this.userService.create(data);
    } catch (error) {
      throw error;
    }
  }


}
