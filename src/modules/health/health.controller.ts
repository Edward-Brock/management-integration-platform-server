import { Controller, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';
import { platform } from 'os';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
    private prismaHealth: PrismaHealthIndicator,
    private prisma: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    /**
     * 判断当前系统环境，若为 Windows 则使用 "D:\" 否则使用 "/"
     */
    let storagePath: string;
    if (platform() === 'win32') {
      storagePath = 'D:\\';
    } else {
      storagePath = '/';
    }

    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
      () =>
        this.disk.checkStorage('storage', {
          path: storagePath,
          thresholdPercent: 0.5,
        }),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      async () => this.prismaHealth.pingCheck('prisma', this.prisma),
    ]);
  }
}
