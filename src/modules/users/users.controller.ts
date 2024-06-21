import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { DynamicRoles } from '../../middleware/role/roles.decorator';
import { RolesGuard } from '../../middleware/guard/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import * as COS from 'cos-nodejs-sdk-v5';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  private readonly cos: COS = new COS({
    SecretId: process.env.COS_SECRET_ID, // 密钥Id
    SecretKey: process.env.COS_SECRET_KEY, // 密钥Key
  });
  private readonly bucket: string = process.env.COS_BUCKET;
  private readonly region: string = process.env.COS_REGION;
  private readonly baseParams: COS.PutObjectParams = {
    Bucket: this.bucket, // 桶名称
    Region: this.region, // 桶的所属地域
    Body: undefined, // 上传的文件二进制流
    Key: '', // 文件在桶中的存储path，以及存储名称
  };

  /**
   * 头像上传
   * @param req
   * @param file 头像文件
   */
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('avatar', {
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
    const params = Object.assign(this.baseParams, {
      Body: file.buffer,
      Key: `/mip/avatar/${Date.now() + '-' + Math.round(Math.random() * 1e9) + extname(file.originalname)}`,
    });
    try {
      const res = await this.cos.putObject(params);
      // 将 COS 返回的 Location 地址通过截取 .com 字段获取后面的字符串
      const index = res.Location.indexOf('.com');
      // 将 Location 重新赋值给自己
      res.Location = res.Location.substring(index + 5);
      // 从请求中获取用户ID
      const userId = req.user.id;
      if (!file) {
        throw new BadRequestException('File is not valid');
      }
      // 将上传成功的图片路径更新替换当前用户头像
      return await this.usersService.update(userId, {
        avatar: res.Location,
      });
    } catch (error) {
      await this.remove(params.Key);
      throw new HttpException('文件上传失败', HttpStatus.BAD_REQUEST);
    }
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
