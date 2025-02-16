import * as dotenv from "dotenv"
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL_PROD : "http://localhost:3002",
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true,
    },
  });
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
