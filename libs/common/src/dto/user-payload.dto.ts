import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UserPayloadDto {
  @IsString()
  @IsNotEmpty()
  sub: string;

  @IsIn(['refresh', 'access'])
  @IsNotEmpty()
  type: 'refresh' | 'access';
}
