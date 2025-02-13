import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { jwtConstants } from 'src/config/secrets';
import { PrismaService } from 'src/db/prisma.service';


const JWT = JwtModule.register({
  global: true,
  secret: jwtConstants.secret,
  signOptions: { expiresIn: '30 days' },
});

@Module({
  imports: [
    JWT,
    UserModule,
  ],
  controllers: [AuthController],
  exports: [AuthService],
  providers: [AuthService, JwtService, PrismaService],
})
export class AuthModule { }
