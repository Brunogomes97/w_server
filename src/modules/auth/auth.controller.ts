import { Controller, Post, Body, HttpCode, HttpStatus, UseFilters, Get, UseGuards, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInDto } from './dto/auth.dto';
import { NotFoundExceptionFilter } from 'src/filters/entityNotFound.filter';
import { AuthGuard } from './auth.guard';
import { AuthRequest } from 'src/types/HttpRequest';

@UseFilters(NotFoundExceptionFilter)
@UsePipes(new ValidationPipe({ transform: true }))
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() data: signInDto) {
    try {
      return await this.authService.signIn(data);
    } catch (error) {
      throw error;
    }
  }

  //Rota de Validação de Sessão
  @UseGuards(AuthGuard)
  @Get('session')
  getSession(@Req() req: AuthRequest) {
    try {
      return {
        user: req.user,
      }
    } catch (err) {
      throw err;
    }
  }


}
