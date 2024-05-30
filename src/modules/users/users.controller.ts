import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { DynamicRoles } from '../../middleware/role/roles.decorator';
import { RolesGuard } from '../../middleware/guard/roles.guard';

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
   */
  @Get(':userId/details')
  async getUserRolesAndPermissions(@Param('userId') userId: string) {
    return this.usersService.getUserRolesAndPermissions(userId);
  }

  @Get()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  @DynamicRoles('ADMIN')
  @UseGuards(RolesGuard)
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
  @DynamicRoles('ADMIN')
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
