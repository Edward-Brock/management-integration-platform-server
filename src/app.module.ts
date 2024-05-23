import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guard/jwt-auth.guard';
import { OptionsModule } from './modules/options/options.module';
import { SettingsModule } from './modules/users/settings/settings.module';
import { WinstonModule } from 'nest-winston';
import winstonConfig from './config/winston.config';
import { GlobalResponseInterceptor } from './middleware/interceptor/global-response.interceptor';
import GlobalExceptionFilter from './middleware/filter/global-exception.filter';
import { RolesModule } from './modules/users/roles/roles.module';
import { PermissionsModule } from './modules/users/permissions/permissions.module';

@Module({
  imports: [
    // Winston 配置
    WinstonModule.forRoot(winstonConfig),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.SERVER_ENV === 'DEVELOPMENT'
          ? '.env.development.local'
          : '.env.production.local',
    }),
    PermissionsModule,
    RolesModule,
    SettingsModule,
    OptionsModule,
    AuthModule,
    UsersModule,
    HealthModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 应用全局过滤器
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    // 应用拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalResponseInterceptor,
    },
    // 启用全局身份验证（Authentication）
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
