import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OptionsService } from './options.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/constants';
import { RolesGuard } from '../../middleware/guard/roles.guard';
import { DynamicRoles } from '../../middleware/role/roles.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Controller('options')
@ApiTags('options')
@DynamicRoles('ADMIN')
@UseGuards(RolesGuard)
export class OptionsController {
  constructor(
    private readonly optionsService: OptionsService,
    private prisma: PrismaService,
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
  create(@Body() createOptionDto: CreateOptionDto) {
    return this.optionsService.create(createOptionDto);
  }

  @Get()
  async findAll() {
    return this.optionsService.findAll();
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.optionsService.findOne(name);
  }

  @Patch(':name')
  update(
    @Param('name') name: string,
    @Body() updateOptionDto: UpdateOptionDto,
  ) {
    return this.optionsService.update(name, updateOptionDto);
  }

  @Delete(':name')
  remove(@Param('name') name: string) {
    return this.optionsService.remove(name);
  }
}
