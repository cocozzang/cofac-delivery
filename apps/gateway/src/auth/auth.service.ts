import { USER_SERVICE, UserMicroService } from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  authService: UserMicroService.AuthServiceClient;

  constructor(
    @Inject(USER_SERVICE)
    private readonly userMicroService: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authService = this.userMicroService.getService(
      UserMicroService.AUTH_SERVICE_NAME,
    );
  }

  register(token: string, registerDto: RegisterDto) {
    return lastValueFrom(
      this.authService.registerUser({ ...registerDto, token }),
    );
  }

  login(token: string) {
    return lastValueFrom(this.authService.loginUser({ token }));
  }
}
