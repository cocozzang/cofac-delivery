import {
  Controller,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GrpcInterceptor, UserMicroService } from '@app/common';
import { Metadata } from '@grpc/grpc-js';

@UseInterceptors(GrpcInterceptor)
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

  loginUser(request: UserMicroService.LoginUserRequest, metadata: Metadata) {
    const { token } = request;

    if (!token) {
      throw new UnauthorizedException('basic auth token을 입력해주세요');
    }

    return this.authService.login(token);
  }
}
