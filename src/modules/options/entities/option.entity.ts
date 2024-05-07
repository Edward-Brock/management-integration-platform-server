import { Option } from '@prisma/client';

export class OptionEntity implements Option {
  id: number;
  name: string;
  value: string;
}
