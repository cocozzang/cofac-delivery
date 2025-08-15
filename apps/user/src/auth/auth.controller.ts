import { Controller, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserMicroService } from '@app/common';

@Controller('auth')
@UserMicroService.AuthServiceControllerMethods()
export class AuthController implements UserMicroService.AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  async parseBearerToken(request: UserMicroService.ParseBearerTokenRequest) {
    return await this.authService.parseBearerToken(request.token, false);
  }

  registerUser(request: UserMicroService.RegisterUserRequest) {
    const { token } = request;

    if (!token) {
      throw new UnauthorizedException('basic auth token을 입력해주세요');
    }

    return this.authService.register(token, request);
  }

  loginUser(request: UserMicroService.LoginUserRequest) {
    const { token } = request;

    if (!token) {
      throw new UnauthorizedException('basic auth token을 입력해주세요');
    }

    return this.authService.login(token);
  }
}
