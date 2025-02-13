import {
  INestApplication,
  Injectable,
  OnModuleInit,
  BeforeApplicationShutdown,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, BeforeApplicationShutdown
{
  private app: INestApplication;

  async onModuleInit() {
    await this.$connect();
  }

  setApp(app: INestApplication) {
    this.app = app;
  }

  async beforeApplicationShutdown() {
    await this.app.close();
  }
}
