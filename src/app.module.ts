import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaService } from './db/prisma.service';
import { NotasModule } from './modules/notas/notas.module';

@Module({
  imports: [UserModule, AuthModule, NotasModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule { }
