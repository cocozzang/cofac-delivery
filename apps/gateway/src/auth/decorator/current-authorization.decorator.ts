import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CurrentAuthrization = createParamDecorator(
  (_, context: ExecutionContext) => {
    const req: Request = context.switchToHttp().getRequest();

    return req.headers['authorization'];
  },
);
