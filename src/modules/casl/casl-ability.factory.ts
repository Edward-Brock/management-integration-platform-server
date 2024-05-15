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
import { OptionEntity } from '../options/entities/option.entity';

type Subjects =
  | InferSubjects<
      typeof SettingEntity | typeof UserEntity | typeof OptionEntity
    >
  | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>,
    );

    switch (user.role) {
      case 'ADMIN':
        can(Action.Manage, 'all');
        break;
      case 'USER':
        can(Action.Read, OptionEntity);
        can(Action.Read, UserEntity, { uid: user.uid });
        can(Action.Update, UserEntity, { uid: user.uid });
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
