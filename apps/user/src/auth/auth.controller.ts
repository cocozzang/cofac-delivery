import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { CurrentAuthrization } from './decorator/current-authorization.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(
    @CurrentAuthrization() token: string,
    @Body() registerDto: RegisterDto,
  ) {
    if (token === null) throw new UnauthorizedException('토큰을 입력해주세요');

    return this.authService.register(token, registerDto);
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  loginUser(@CurrentAuthrization() token: string) {
    if (token === null) throw new UnauthorizedException('토큰 주셈');

    return this.authService.login(token);
  }
}
