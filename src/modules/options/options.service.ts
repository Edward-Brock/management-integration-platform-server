import { Injectable } from '@nestjs/common';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';

@Injectable()
export class OptionsService {
  constructor(private prisma: PrismaService) {}

  getVersion() {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    return packageJson.version;
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
