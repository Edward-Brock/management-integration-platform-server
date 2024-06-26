import { Injectable, Logger } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  async addRoleToUser(userId: string, roleId: string) {
    this.logger.log(
      `USER ID ${userId} ADDED THE ${roleId} ROLE`,
      'UsersService',
    );
    return this.prisma.userRole.create({
      data: {
        userId: userId,
        roleId: roleId,
      },
    });
  }

  async getUserRolesAndPermissions(userId: string) {
    this.logger.log(
      `USER ID ${userId} QUERIES ALL ROLES INCLUDED IN HIMSELF`,
      'UsersService',
    );
    const user: any = await this.prisma.user.findUnique({
      where: { id: userId },
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
    if (!user) {
      throw new Error('User not found'); // 或者使用其他适当的错误处理方式
    }
    return new UserEntity(user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map((user: UserEntity) => new UserEntity(user));
  }

  async findOne(id: string) {
    this.logger.log(`USER FIND - ${id}`, 'UsersService');

    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new Error('User not found'); // 或者使用其他适当的错误处理方式
    }
    return new UserEntity(user as UserEntity);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { password, ...rest } = updateUserDto;
    // 检查是否包含密码字段
    if ('password' in updateUserDto) {
      await this.updatePassword(id, password);
    }

    // 合并密码字段和其他字段
    const dataToUpdate = {
      ...(password && { password: await this.hashPassword(password) }), // 如果存在密码，则包含密码字段
      ...rest, // 其他字段
    };

    this.logger.log(`USER UPDATE - ${id} - ${dataToUpdate}`, 'UsersService');

    return this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  private async updatePassword(id: string, newPassword: string) {
    const hashedPassword = await this.hashPassword(newPassword);
    return this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);
    return password;
  }

  remove(id: string) {
    this.logger.log(`USER DELETE - ${id}`, 'UsersService');

    return this.update(id, <UpdateUserDto>{ status: 'INACTIVE' });
  }
}
