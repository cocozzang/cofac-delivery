export interface JwtPayloadInterface {
  sub: string;
  type: 'refresh' | 'access';
}
