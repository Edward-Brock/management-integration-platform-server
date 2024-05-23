import { Injectable, Logger } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    this.logger.log(`USER FIND - ${id}`, 'UsersService');

    return this.prisma.user.findUnique({ where: { id } });
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
