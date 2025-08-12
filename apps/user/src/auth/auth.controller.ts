import {
  Controller,
  UnauthorizedException,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload, Transport } from '@nestjs/microservices';
import { ParseBearerTokenDto } from './dto/parse-bearer-token.dto';
import { RpcInterceptor } from '@app/common/interceptor/rpc.interceptor';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('register')
  // registerUser(
  //   @CurrentAuthrization() token: string,
  //   @Body() registerDto: RegisterDto,
  // ) {
  //   if (token === null) throw new UnauthorizedException('토큰을 입력해주세요');
  //
  //   return this.authService.register(token, registerDto);
  // }
  //
  // @Post('login')
  // @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }))
  // loginUser(@CurrentAuthrization() token: string) {
  //   if (token === null) throw new UnauthorizedException('토큰 주셈');
  //
  //   return this.authService.login(token);
  // }

  @MessagePattern(
    {
      cmd: 'parse_bearer_token',
    },
    Transport.TCP,
  )
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }))
  @UseInterceptors(RpcInterceptor)
  async parseBearerToken(@Payload() payload: ParseBearerTokenDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.authService.parseBearerToken(payload.token, false);
  }

  @MessagePattern({ cmd: 'register' })
  registerUser(@Payload() registerDto: RegisterDto) {
    const { token } = registerDto;

    if (!token) {
      throw new UnauthorizedException('basic auth token을 입력해주세요');
    }

    return this.authService.register(token, registerDto);
  }

  @MessagePattern({ cmd: 'login' })
  loginUser(@Payload() loginDto: LoginDto) {
    const { token } = loginDto;

    if (!token) {
      throw new UnauthorizedException('basic auth token을 입력해주세요');
    }

    return this.authService.login(token);
  }
}
