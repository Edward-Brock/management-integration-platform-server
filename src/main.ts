import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const http_url = configService.get('SERVER_URL');
  const http_port = configService.get('SERVER_PORT');
  const config = new DocumentBuilder()
    .setTitle('Management Integration Platform')
    .setDescription('This is MIP Swagger')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(http_port);
  console.log(`
  ============================================================
  🎉 HTTP SERVICE STARTED: ${http_url}:${http_port}
  ============================================================
  `);
}
bootstrap();
