import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext) => {
    const req: Request = context.switchToHttp().getRequest();

    if (!req.user)
      throw new InternalServerErrorException('TokenGuard를 적용해야합니다.');

    return req.user;
  },
);
