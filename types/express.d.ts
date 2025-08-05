export interface JwtPayloadInterface {
  sub: string;
  role: RoleEnum;
  type: 'refresh' | 'access';
}
