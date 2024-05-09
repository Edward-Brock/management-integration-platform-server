import { Setting } from '@prisma/client';

export class SettingEntity implements Setting {
  background: string;
  userUid: string;
}
