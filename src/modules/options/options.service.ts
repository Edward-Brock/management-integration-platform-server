import { Injectable } from '@nestjs/common';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OptionsService {
  constructor(private prisma: PrismaService) {}

  create(createOptionDto: CreateOptionDto) {
    return this.prisma.option.create({ data: createOptionDto });
  }

  findAll() {
    return this.prisma.option.findMany();
  }

  findOne(id: number) {
    return this.prisma.option.findUnique({ where: { id } });
  }

  update(id: number, updateOptionDto: UpdateOptionDto) {
    return this.prisma.option.update({
      where: { id },
      data: updateOptionDto,
    });
  }

  remove(id: number) {
    return this.prisma.option.delete({ where: { id } });
  }
}
