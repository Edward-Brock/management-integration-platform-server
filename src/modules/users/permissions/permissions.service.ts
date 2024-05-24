import { Injectable, Logger } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  create(createPermissionDto: CreatePermissionDto) {
    this.logger.log(
      `PERMISSION CREATE - ${createPermissionDto.id} - ${createPermissionDto.name} - ${createPermissionDto.description}`,
      'PermissionsService',
    );
    return this.prisma.permission.create({ data: createPermissionDto });
  }

  findAll() {
    return this.prisma.permission.findMany();
  }

  findOne(id: string) {
    return this.prisma.permission.findUnique({ where: { id } });
  }

  update(id: string, updatePermissionDto: UpdatePermissionDto) {
    this.logger.log(
      `PERMISSION UPDATE - ${id} - NAME:${updatePermissionDto.name} - DESCRIPTION:${updatePermissionDto.description}`,
      'PermissionsService',
    );
    return this.prisma.role.update({
      where: { id },
      data: updatePermissionDto,
    });
  }

  remove(id: string) {
    this.logger.log(`PERMISSION DELETE - ${id}`, 'PermissionsService');
    return this.prisma.permission.delete({ where: { id } });
  }
}
