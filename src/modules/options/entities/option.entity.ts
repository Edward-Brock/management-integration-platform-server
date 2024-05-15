import { Option } from '@prisma/client';

export class OptionEntity implements Option {
  name: string;
  value: string;
  autoload: boolean;
}
