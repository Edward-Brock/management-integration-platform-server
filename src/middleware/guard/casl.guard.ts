import { Injectable, ForbiddenException } from '@nestjs/common';
import { CaslAbilityFactory } from '../../modules/casl/casl-ability.factory';
import { User } from '@prisma/client';
import { Action } from '../../modules/casl/actions.enum';

@Injectable()
export class CaslGuard {
  constructor(private readonly caslAbilityFactory: CaslAbilityFactory) {}

  private checkPermission(user: User, action: Action, entity: any, uid) {
    // 创建给定用户的 Casl 能力
    const ability = this.caslAbilityFactory.createForUser(user);
    // 创建 UserEntity 的新实例
    const newEntity = new entity();

    // 如果提供了 UID，则将其分配给设置实体的 uid 属性
    if (uid) {
      newEntity.uid = uid;
    }

    // 检查用户是否有权限在设置上执行指定的操作
    if (!ability.can(action, newEntity)) {
      const errorMessage = `${user.uid} - 您无权执行 ${action.toUpperCase()} 操作`;
      // 如果不允许，构造错误消息并抛出 ForbiddenException
      throw new ForbiddenException(errorMessage);
    }
  }

  canActivate(user: User, action: Action, entity: any, uid?) {
    return this.checkPermission(user, action, entity, uid);
  }
}
