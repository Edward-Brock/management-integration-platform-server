import { Injectable } from '@nestjs/common';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TimelinesService {
  constructor(private prisma: PrismaService) {}

  create(createTimelineDto: CreateTimelineDto) {
    return this.prisma.timeline.create({
      data: {
        content: createTimelineDto.content,
        user: {
          connect: {
            id: createTimelineDto.userId,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.timeline.findMany({ where: { is_delete: false } });
  }

  findUserAllTimelines(id: string) {
    return this.prisma.timeline.findMany({
      where: { id, is_delete: false },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.timeline.findUnique({ where: { id, is_delete: true } });
  }

  update(id: string, updateTimelineDto: UpdateTimelineDto) {
    return this.prisma.timeline.update({
      where: { id },
      data: updateTimelineDto,
    });
  }

  remove(id: string) {
    return this.update(id, { is_delete: true });
  }
}
