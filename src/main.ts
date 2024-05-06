import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const server_env = configService.get('SERVER_ENV');
  const http_url = configService.get('SERVER_URL');
  const http_port = configService.get('SERVER_PORT');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const version = packageJson.version;
  /**
   * 根据环境变量文件内的 SERVER_ENV 进行判断
   * 若为 development 则为开发环境，对 http_url 及 http_port 进行拼接
   * 否则为生产环境，直接使用 http_url
   */
  let serverAddress: string;
  if (server_env === 'DEVELOPMENT') {
    serverAddress = `${http_url}:${http_port}`;
  } else {
    serverAddress = http_url;
  }
  const config = new DocumentBuilder()
    .setTitle('Management Integration Platform')
    .setDescription('This is MIP Swagger')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(http_port);
  console.log(`
  ============================================================
  → ENVIRONMENT: \x1b[41m${server_env}\x1b[0m
  № SERVER VERSION - ${version}
  ✔ HTTP SERVICE STARTED - ${serverAddress}
  ============================================================
  `);
}
bootstrap();
