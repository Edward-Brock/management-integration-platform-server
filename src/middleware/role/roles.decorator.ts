import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const DynamicRoles = (...roles: string[]) =>
  SetMetadata(ROLES_KEY, roles);
