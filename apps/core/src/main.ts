import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ApiKeyGuard } from './common/guards/api-key.guard';

(BigInt.prototype as any).toJSON = function () { return this.toString(); };

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.useGlobalGuards(new ApiKeyGuard());
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
