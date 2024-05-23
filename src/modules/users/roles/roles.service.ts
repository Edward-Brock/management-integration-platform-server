import { Injectable, Logger } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  create(createRoleDto: CreateRoleDto) {
    this.logger.log(
      `ROLE CREATE - ${createRoleDto.id} - ${createRoleDto.name}`,
      'RolesService',
    );
    return this.prisma.role.create({ data: createRoleDto });
  }

  findAll() {
    return this.prisma.role.findMany();
  }

  findOne(id: string) {
    return this.prisma.role.findUnique({ where: { id } });
  }

  update(id: string, updateRoleDto: UpdateRoleDto) {
    this.logger.log(
      `ROLE UPDATE - ${id} - NAME:${updateRoleDto.name} - DESCRIPTION:${updateRoleDto.description}`,
      'RolesService',
    );
    return this.prisma.role.update({
      where: { id },
      data: updateRoleDto,
    });
  }

  remove(id: string) {
    this.logger.log(`ROLE DELETE - ${id}`, 'RolesService');
    return this.prisma.role.delete({ where: { id } });
  }
}
