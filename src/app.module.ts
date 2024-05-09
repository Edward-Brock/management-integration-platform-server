import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guard/jwt-auth.guard';
import { OptionsModule } from './modules/options/options.module';
import { SettingsModule } from './modules/users/settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.SERVER_ENV === 'DEVELOPMENT'
          ? '.env.development.local'
          : '.env.production.local',
    }),
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
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
