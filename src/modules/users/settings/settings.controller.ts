import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { ApiTags } from '@nestjs/swagger';
import { CaslAbilityFactory } from '../../casl/casl-ability.factory';
import { Action } from '../../casl/actions.enum';
import { SettingEntity } from './entities/setting.entity';

@Controller('settings')
@ApiTags('settings')
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService,
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
    // 创建 SettingEntity 的新实例
    const settings = new SettingEntity();
    // 如果提供了 UID，则将其分配给设置实体的 userUid 属性
    if (uid) {
      settings.userUid = uid;
    }
    // 检查用户是否有权限在设置上执行指定的操作
    if (!ability.can(action, settings)) {
      // 如果不允许，构造错误消息并抛出 ForbiddenException
      const errorMessage = `You are not allowed to ${action.toUpperCase()} settings`;
      throw new ForbiddenException(errorMessage);
    }
  }

  @Post()
  create(@Body() createSettingDto: CreateSettingDto) {
    return this.settingsService.create(createSettingDto);
  }

  @Get()
  findAll(@Request() req) {
    this.checkPermission(req.user, Action.Read);
    return this.settingsService.findAll();
  }

  @Get(':uid')
  findOne(@Param('uid') uid: string, @Request() req) {
    this.checkPermission(req.user, Action.Read, uid);
    return this.settingsService.findOne(uid);
  }

  @Patch(':uid')
  update(
    @Param('uid') uid: string,
    @Body() updateSettingDto: UpdateSettingDto,
    @Request() req,
  ) {
    this.checkPermission(req.user, Action.Update, uid);
    return this.settingsService.update(uid, updateSettingDto);
  }
}
