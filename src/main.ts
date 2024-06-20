import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import * as chalk from 'chalk';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useStaticAssets('uploads', { prefix: '/uploads/' });

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
    .setTitle(packageJson.name)
    .setDescription(packageJson.description)
    .setVersion(version)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(http_port);
  console.log(`
  ============================================================
  → ENVIRONMENT - ${chalk.bgRed(server_env)}
  № SERVER VERSION - ${version}
  ✔ HTTP SERVICE STARTED - ${serverAddress}
  ============================================================
  `);
}
bootstrap();
