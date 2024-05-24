import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 将 userId 绑定角色
   * @param body userId：用户 ID, roleId：角色 ID
   */
  @Post('addRole')
  async addRoleToUser(@Body() body: { userId: string; roleId: string }) {
    const { userId, roleId } = body;
    return this.usersService.addRoleToUser(userId, roleId);
  }

  /**
   * 使用 userId 查询用户所包含的所有角色信息
   * @param userId 用户 ID
   */ s;
  @Get(':userId/details')
  async getUserRolesAndPermissions(@Param('userId') userId: string) {
    return this.usersService.getUserRolesAndPermissions(userId);
  }

  @Get()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: UserEntity })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: UserEntity })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: UserEntity })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
