import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  // Get,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';


@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
  }),
)
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
