import { Logger, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    // 判断是否存在用户
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (user && isMatch) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException(`Incorrect Password`);
  }

  async register(createUserDto: CreateUserDto) {
    // 检查是否存在相同用户名
    const username = createUserDto.username;
    const existingUser = await this.prisma.user.findUnique({
      where: { username },
    });
    if (existingUser) {
      this.logger.log(`USERNAME ALREADY EXISTS - ${username}`, 'AuthService');
      throw new UnauthorizedException(`User ${username} already exist`);
    }
    createUserDto.password = await this.hashPassword(createUserDto.password);
    this.logger.log(`USER REGISTER - ${username}`, 'AuthService');
    return this.prisma.user.create({
      data: {
        ...createUserDto,
      },
    });
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);
    return password;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);
    const decodedToken = this.jwtService.decode(token) as any;
    this.logger.log(
      `USER LOGIN - ${user.uid} - ${user.username} - ${user.role}`,
      'AuthService',
    );
    return {
      access_token: token,
      exp: decodedToken.exp,
      iat: decodedToken.iat,
    };
  }
}
