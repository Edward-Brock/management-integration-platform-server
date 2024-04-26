import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const http_url = configService.get('SERVER_URL');
  const http_port = configService.get('SERVER_PORT');
  await app.listen(http_port);
  console.log(`
  ============================================================
  🎉 HTTP SERVICE STARTED: ${http_url}:${http_port}
  ============================================================
  `);
}
bootstrap();
