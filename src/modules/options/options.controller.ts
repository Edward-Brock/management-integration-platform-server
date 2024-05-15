import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OptionsService } from './options.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/constants';

@Controller('options')
@ApiTags('options')
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}

  /**
   * 获取当前服务端运行版本
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
  findAll() {
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
