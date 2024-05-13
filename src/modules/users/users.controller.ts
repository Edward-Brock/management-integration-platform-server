import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { Action } from '../casl/actions.enum';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  /**
   * 私有方法，用于检查用户对设置执行特定操作的权限。
   * @param user 正在检查权限的用户对象。
   * @param action 正在执行的设置操作（例如，Read、Update）。
   * @param uid 可选。适用的设置实体的 UID。
   * @throws ForbiddenException 如果用户没有执行指定操作的权限。
   */
  private checkPermission(user, action: Action, uid?: string) {
    // 创建给定用户的 Casl 能力
    const ability = this.caslAbilityFactory.createForUser(user);
    // 创建 UserEntity 的新实例
    const users = new UserEntity();
    // 如果提供了 UID，则将其分配给设置实体的 uid 属性
    if (uid) {
      users.uid = uid;
    }
    // 检查用户是否有权限在设置上执行指定的操作
    if (!ability.can(action, users)) {
      // 如果不允许，构造错误消息并抛出 ForbiddenException
      const errorMessage = `You are not allowed to ${action.toUpperCase()} users`;
      throw new ForbiddenException(errorMessage);
    }
  }

  @Get()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  findAll(@Request() req) {
    this.checkPermission(req.user, Action.Read);
    return this.usersService.findAll();
  }

  @Get(':uid')
  @ApiOkResponse({ type: UserEntity })
  findOne(@Param('uid') uid: string, @Request() req) {
    this.checkPermission(req.user, Action.Read, uid);
    return this.usersService.findOne(uid);
  }

  @Patch(':uid')
  @ApiCreatedResponse({ type: UserEntity })
  update(
    @Param('uid') uid: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    this.checkPermission(req.user, Action.Update, uid);
    return this.usersService.update(uid, updateUserDto);
  }

  @Delete(':uid')
  @ApiOkResponse({ type: UserEntity })
  remove(@Param('uid') uid: string, @Request() req) {
    this.checkPermission(req.user, Action.Delete, uid);
    return this.usersService.remove(uid);
  }
}
