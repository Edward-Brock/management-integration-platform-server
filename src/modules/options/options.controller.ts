import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { OptionsService } from './options.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/constants';
import { Action } from '../casl/actions.enum';
import { OptionEntity } from './entities/option.entity';
import { CaslGuard } from '../../middleware/guard/casl.guard';

@Controller('options')
@ApiTags('options')
export class OptionsController {
  constructor(
    private readonly optionsService: OptionsService,
    private caslGuard: CaslGuard,
  ) {}

  /**
   * 获取当前标记自动加载的数据
   */
  @Public()
  @Get('autoload')
  autoload() {
    return this.optionsService.autoload();
  }

  @Post()
  create(@Body() createOptionDto: CreateOptionDto, @Request() req) {
    this.caslGuard.canActivate(req.user, Action.Create, OptionEntity);
    return this.optionsService.create(createOptionDto);
  }

  @Get()
  findAll(@Request() req) {
    this.caslGuard.canActivate(req.user, Action.Read, OptionEntity);
    return this.optionsService.findAll();
  }

  @Get(':name')
  findOne(@Param('name') name: string, @Request() req) {
    this.caslGuard.canActivate(req.user, Action.Read, OptionEntity);
    return this.optionsService.findOne(name);
  }

  @Patch(':name')
  update(
    @Param('name') name: string,
    @Body() updateOptionDto: UpdateOptionDto,
    @Request() req,
  ) {
    this.caslGuard.canActivate(req.user, Action.Update, OptionEntity);
    return this.optionsService.update(name, updateOptionDto);
  }

  @Delete(':name')
  remove(@Param('name') name: string, @Request() req) {
    this.caslGuard.canActivate(req.user, Action.Delete, OptionEntity);
    return this.optionsService.remove(name);
  }
}
