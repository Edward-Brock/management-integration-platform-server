import { Injectable } from '@nestjs/common';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OptionsService {
  constructor(private prisma: PrismaService) {}

  async autoload() {
    return this.prisma.option.findMany({
      where: {
        autoload: true,
      },
    });
  }

  create(createOptionDto: CreateOptionDto) {
    return this.prisma.option.create({ data: createOptionDto });
  }

  findAll() {
    return this.prisma.option.findMany();
  }

  findOne(name: string) {
    return this.prisma.option.findUnique({ where: { name } });
  }

  update(name: string, updateOptionDto: UpdateOptionDto) {
    return this.prisma.option.update({
      where: { name },
      data: updateOptionDto,
    });
  }

  remove(name: string) {
    return this.prisma.option.delete({ where: { name } });
  }
}
