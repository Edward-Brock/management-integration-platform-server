import { SetMetadata } from '@nestjs/common';

export const jwtConstants = {
  secret: `${process.env.JWT_SECRET}`,
  jwtExpiresInTime: `${process.env.JWT_EXPIRESIN_TIME}`,
};
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
