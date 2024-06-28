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
import { TimelinesService } from './timelines.service';
import { CreateTimelineDto } from './dto/create-timeline.dto';
import { UpdateTimelineDto } from './dto/update-timeline.dto';
import { ApiTags } from '@nestjs/swagger';
import { DynamicRoles } from '../../middleware/role/roles.decorator';
import { RolesGuard } from '../../middleware/guard/roles.guard';

@Controller('timelines')
@ApiTags('timelines')
export class TimelinesController {
  constructor(private readonly timelinesService: TimelinesService) {}

  @Post()
  create(@Body() createTimelineDto: CreateTimelineDto) {
    return this.timelinesService.create(createTimelineDto);
  }

  /**
   * 获取单个用户的所有时间线数据
   */
  @Get(':userId/allTimelines')
  async findUserAllTimelines(@Param('userId') userId: string) {
    return this.timelinesService.findUserAllTimelines(userId);
  }

  /**
   * 获取全部用户的所有时间线数据
   */
  @Get()
  @DynamicRoles('ADMIN')
  @UseGuards(RolesGuard)
  findAll() {
    return this.timelinesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timelinesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTimelineDto: UpdateTimelineDto,
  ) {
    return this.timelinesService.update(id, updateTimelineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timelinesService.remove(id);
  }
}
