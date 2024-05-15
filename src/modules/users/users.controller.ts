import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { Action } from '../casl/actions.enum';
import { CaslGuard } from '../../middleware/guard/casl.guard';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private caslGuard: CaslGuard,
  ) {}

  @Get()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  findAll(@Request() req) {
    this.caslGuard.canActivate(req.user, Action.Read, UserEntity);
    return this.usersService.findAll();
  }

  @Get(':uid')
  @ApiOkResponse({ type: UserEntity })
  findOne(@Param('uid') uid: string, @Request() req) {
    this.caslGuard.canActivate(req.user, Action.Read, UserEntity, uid);
    return this.usersService.findOne(uid);
  }

  @Patch(':uid')
  @ApiCreatedResponse({ type: UserEntity })
  update(
    @Param('uid') uid: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    this.caslGuard.canActivate(req.user, Action.Update, UserEntity, uid);
    return this.usersService.update(uid, updateUserDto);
  }

  @Delete(':uid')
  @ApiOkResponse({ type: UserEntity })
  remove(@Param('uid') uid: string, @Request() req) {
    this.caslGuard.canActivate(req.user, Action.Delete, UserEntity, uid);
    return this.usersService.remove(uid);
  }
}
