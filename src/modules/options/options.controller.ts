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
  @Get('version')
  getVersion() {
    return this.optionsService.getVersion();
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOptionDto: UpdateOptionDto) {
    return this.optionsService.update(+id, updateOptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.optionsService.remove(+id);
  }
}
