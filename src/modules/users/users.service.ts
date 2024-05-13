import { Injectable, Logger } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as path from 'node:path';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(uid: string) {
    this.logger.log(`USER FIND - ${uid}`, path.basename(__filename));

    return this.prisma.user.findUnique({ where: { uid } });
  }

  async update(uid: string, updateUserDto: UpdateUserDto) {
    const { password, ...rest } = updateUserDto;
    // 检查是否包含密码字段
    if ('password' in updateUserDto) {
      await this.updatePassword(uid, password);
    }

    // 合并密码字段和其他字段
    const dataToUpdate = {
      ...(password && { password: await this.hashPassword(password) }), // 如果存在密码，则包含密码字段
      ...rest, // 其他字段
    };

    this.logger.log(
      `USER UPDATE - ${uid} - ${dataToUpdate}`,
      path.basename(__filename),
    );

    return this.prisma.user.update({
      where: { uid },
      data: dataToUpdate,
    });
  }

  private async updatePassword(uid: string, newPassword: string) {
    const hashedPassword = await this.hashPassword(newPassword);
    return this.prisma.user.update({
      where: { uid },
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

  remove(uid: string) {
    this.logger.log(`USER DELETE - ${uid}`, path.basename(__filename));

    return this.update(uid, <UpdateUserDto>{ status: 'INACTIVE' });
  }
}
