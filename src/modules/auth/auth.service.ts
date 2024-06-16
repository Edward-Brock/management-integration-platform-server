import { Logger, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { RolesService } from '../users/roles/roles.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private readonly logger: Logger,
    private rolesService: RolesService,
    private usersService: UsersService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    // 判断是否存在用户
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(pass, user.password);
    if (user && isMatch) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException(`Incorrect Password`);
  }

  async register(createUserDto: CreateUserDto) {
    // 1. 检查是否存在相同用户名
    const username = createUserDto.username;
    const existingUser = await this.prisma.user.findUnique({
      where: { username },
    });
    // 2. 判断当前注册用户名是否已存在
    if (existingUser) {
      this.logger.log(`USERNAME ALREADY EXISTS - ${username}`, 'AuthService');
      throw new UnauthorizedException(`User ${username} already exist`);
    }
    // 3. 对注册用户密码进行加密
    createUserDto.password = await this.hashPassword(createUserDto.password);
    this.logger.log(`USER REGISTER - ${username}`, 'AuthService');

    // 4. 创建注册用户信息
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
      },
    });

    // 5. 查找 role（角色）为 USER 的 ID，并将角色同步添加给当前注册用户
    const role = await this.rolesService.findOne('USER');
    if (!role)
      throw new UnauthorizedException(
        `权限 USER 未找到，注册失败，请联系管理员`,
      );
    // 6. 通过 ID 将用户与 USER 角色进行绑定
    await this.usersService.addRoleToUser(user.id, role.id);

    // 7. 注册成功，返回包含角色信息的用户个人信息
    return this.usersService.getUserRolesAndPermissions(user.id);
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
