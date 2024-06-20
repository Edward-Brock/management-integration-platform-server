import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Req,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { DynamicRoles } from '../../middleware/role/roles.decorator';
import { RolesGuard } from '../../middleware/guard/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 头像上传
   * @param req
   * @param file 头像文件
   */
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatar',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `avatar-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedMimeTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        } else {
          callback(null, true);
        }
      },
      limits: {
        fields: 1,
        fileSize: 1024 * 1024 * 2, // 限制文件大小为2MB
      },
    }),
  )
  async uploadAvatar(
    @Req() req,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    const userId = req.user.id; // 从请求中获取用户ID
    if (!file) {
      throw new BadRequestException('File is not valid');
    }
    // 将上传成功的图片路径更新替换当前用户头像
    const response = await this.usersService.update(userId, {
      avatar: file.path,
    });

    if (response) return file;
  }

  /**
   * 将 userId 绑定角色
   * @param body userId：用户 ID, roleId：角色 ID
   */
  @Post('addRole')
  async addRoleToUser(@Body() body: { userId: string; roleId: string }) {
    const { userId, roleId } = body;
    return this.usersService.addRoleToUser(userId, roleId);
  }

  /**
   * 使用 userId 查询用户所包含的所有角色信息
   * @param userId 用户 ID
   */
  @Get(':userId/details')
  async getUserRolesAndPermissions(@Param('userId') userId: string) {
    return this.usersService.getUserRolesAndPermissions(userId);
  }

  @Get()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  @DynamicRoles('ADMIN')
  @UseGuards(RolesGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: UserEntity })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: UserEntity })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: UserEntity })
  @DynamicRoles('ADMIN')
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
