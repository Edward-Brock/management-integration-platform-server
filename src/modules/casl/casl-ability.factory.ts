import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Action } from './actions.enum';
import { UserEntity } from '../users/entities/user.entity';
import { SettingEntity } from '../users/settings/entities/setting.entity';

type Subjects = InferSubjects<typeof SettingEntity | typeof UserEntity> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>,
    );

    console.log(
      `当前用户：${user.username}，UID为：${user.uid}，权限为：${user.role}`,
    );

    switch (user.role) {
      case 'ADMIN':
        can(Action.Manage, 'all');
        break;
      case 'USER':
        can(Action.Read, SettingEntity, { userUid: user.uid });
        can(Action.Update, SettingEntity, { userUid: user.uid });
        break;
    }

    return build({
      // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
