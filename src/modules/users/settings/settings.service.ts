import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  create(createSettingDto: CreateSettingDto) {
    return this.prisma.setting.create({ data: createSettingDto });
  }

  findAll() {
    return this.prisma.setting.findMany();
  }

  findOne(userId: string) {
    return this.prisma.setting.findUnique({ where: { userId } });
  }

  update(userId: string, updateSettingDto: UpdateSettingDto) {
    return this.prisma.setting.update({
      where: { userId },
      data: updateSettingDto,
    });
  }
}
