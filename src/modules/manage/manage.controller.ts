import { Controller, Get, UseGuards } from '@nestjs/common';
import { ManageService } from './manage.service';
import { ApiTags } from '@nestjs/swagger';
import { DynamicRoles } from '../../middleware/role/roles.decorator';
import { RolesGuard } from '../../middleware/guard/roles.guard';

@Controller('manage')
@ApiTags('manage')
@DynamicRoles('ADMIN')
@UseGuards(RolesGuard)
export class ManageController {
  constructor(private readonly manageService: ManageService) {}

  /**
   * 统计全部用户数量
   */
  @Get('countTotalNumberUsers')
  async countTotalNumberUsers() {
    return this.manageService.countTotalNumberUsers();
  }
}
