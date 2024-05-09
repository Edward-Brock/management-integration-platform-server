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

  @Post()
  create(@Body() createSettingDto: CreateSettingDto) {
    return this.settingsService.create(createSettingDto);
  }

  @Get()
  findAll(@Request() req) {
    // 获取当前用户的能力
    const ability = this.caslAbilityFactory.createForUser(req.user);
    // 如果用户不是管理员，则创建一个只包含当前用户的临时对象
    let settings: SettingEntity | undefined;
    if (req.user.role !== 'ADMIN') {
      settings = { userUid: req.user.uid } as SettingEntity;
    }
    // 判断当前用户是否有权限读取设置信息
    if (!ability.can(Action.Read, settings)) {
      throw new ForbiddenException('You are not allowed to findAll settings');
    }
    // 如果有权限，就执行相应的操作
    return this.settingsService.findAll();
  }

  @Get(':uid')
  findOne(@Param('uid') uid: string, @Request() req) {
    const ability = this.caslAbilityFactory.createForUser(req.user);
    const settings = new SettingEntity();
    settings.userUid = uid;
    // 判断当前用户是否有权限读取指定的设置信息
    if (!ability.can(Action.Read, settings)) {
      throw new ForbiddenException('You are not allowed to findOne settings');
    }
    // 如果有权限，就执行相应的操作
    return this.settingsService.findOne(uid);
  }

  @Patch(':uid')
  update(
    @Param('uid') uid: string,
    @Body() updateSettingDto: UpdateSettingDto,
    @Request() req,
  ) {
    const ability = this.caslAbilityFactory.createForUser(req.user);
    const settings = new SettingEntity();
    settings.userUid = uid;
    // 判断当前用户是否有权限读取指定的设置信息
    if (!ability.can(Action.Update, settings)) {
      throw new ForbiddenException('You are not allowed to update settings');
    }
    // 如果有权限，就执行相应的操作
    return this.settingsService.update(uid, updateSettingDto);
  }
}
