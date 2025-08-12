import { JwtPayloadInterface } from '@app/common';

type AuthUser = JwtPayloadInterface;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface User extends AuthUser {}
