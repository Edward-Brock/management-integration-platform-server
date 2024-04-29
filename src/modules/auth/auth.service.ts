import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    const isMatch = await bcrypt.compare(pass, user.password);
    if (user && isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async register(createUserDto: CreateUserDto) {
    // 检查是否存在相同用户名
    const existingUser = await this.usersService.findOne(
      createUserDto.username,
    );
    if (existingUser) {
      throw new Error('Username already exists');
    }
    createUserDto.password = await this.hashPassword(createUserDto.password);
    return this.prisma.user.create({ data: createUserDto });
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);
    return password;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.uid };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
