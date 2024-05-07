import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(uid: string) {
    console.log('USERS: USER FIND', {
      uid: uid,
      date: new Date(),
    });

    return this.prisma.user.findUnique({ where: { uid } });
  }

  async update(uid: string, updateUserDto: UpdateUserDto) {
    console.log(uid);
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

    console.log('USERS: USER UPDATE', {
      uid: uid,
      data: dataToUpdate,
      date: new Date(),
    });

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
    console.log('USERS: USER DELETE', {
      uid: uid,
      date: new Date(),
    });

    return this.update(uid, <UpdateUserDto>{ status: 'INACTIVE' });
  }
}
