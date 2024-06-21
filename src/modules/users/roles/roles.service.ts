import { Injectable, Logger } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class RolesService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  async addPermissionToRole(roleId: string, permissionId: string) {
    this.logger.log(
      `ROLE ID ${roleId} ADDED THE ${permissionId} PERMISSION`,
      'RolesService',
    );
    return this.prisma.rolePermission.create({
      data: {
        roleId: roleId,
        permissionId: permissionId,
      },
    });
  }

  async getRolePermissions(roleId: string) {
    this.logger.log(
      `ROLE ID ${roleId} QUERIES ALL ROLES INCLUDED IN HIMSELF`,
      'RolesService',
    );
    return this.prisma.role.findUnique({
      where: { id: roleId },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  async allUsersRolePermissions() {
    const users: any = await this.prisma.user.findMany({
      include: {
        roles: {
          select: {
            role: {
              select: {
                name: true,
                description: true,
                permissions: {
                  select: {
                    permission: {
                      select: {
                        name: true,
                        description: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return users.map((user: UserEntity) => new UserEntity(user));
  }

  create(createRoleDto: CreateRoleDto) {
    this.logger.log(
      `ROLE CREATE - ${createRoleDto.id} - ${createRoleDto.name} - ${createRoleDto.description}`,
      'RolesService',
    );
    return this.prisma.role.create({ data: createRoleDto });
  }

  findAll() {
    return this.prisma.role.findMany();
  }

  findOne(name: string) {
    return this.prisma.role.findUnique({ where: { name } });
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
