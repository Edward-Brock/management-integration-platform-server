import { Setting } from '@prisma/client';

export class SettingEntity implements Setting {
  language: string;
  background: string;
  userId: string;
}
