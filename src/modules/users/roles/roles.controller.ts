import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('roles')
@ApiTags('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * 将 roleId 绑定权限
   * @param body roleId：角色 ID, permissionId：权限 ID
   */
  @Post('addPermission')
  async addPermissionToRole(
    @Body() body: { roleId: string; permissionId: string },
  ) {
    const { roleId, permissionId } = body;
    return this.rolesService.addPermissionToRole(roleId, permissionId);
  }

  /**
   * 使用 roleId 查询角色所包含的所有权限信息
   * @param roleId 角色 ID
   */
  @Get(':roleId/details')
  async RolePermissions(@Param('roleId') roleId: string) {
    return this.rolesService.getRolePermissions(roleId);
  }

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
