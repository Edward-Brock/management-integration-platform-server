import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // 检查是否存在相同用户名
    const existingUser = await this.findOne(createUserDto.username);
    if (existingUser) {
      throw new Error('Username already exists');
    }
    createUserDto.password = await this.hashPassword(createUserDto.password);
    return this.prisma.user.create({ data: createUserDto });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
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

    return this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  private async updatePassword(id: number, newPassword: string) {
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

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
