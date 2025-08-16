import { constructMetadata, USER_SERVICE, UserMicroService } from '@app/common';
import {
  Inject,
  Injectable,
  NestMiddleware,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Request } from 'express';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class BearerTokenMiddleware implements NestMiddleware, OnModuleInit {
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

  async use(req: Request, res: any, next: (error?: any) => void) {
    const token = this.getRawToken(req);

    if (!token) {
      next();
      return;
    }

    const payload = await this.verifyToken(token);

    req.user = payload;

    next();
  }

  getRawToken(req: Request) {
    const authHeader = req.headers['authorization'];

    return authHeader;
  }

  async verifyToken(token: string) {
    const response = await lastValueFrom(
      this.authService.parseBearerToken(
        { token },
        constructMetadata(BearerTokenMiddleware.name, 'verifyToken'),
      ),
    );

    return {
      sub: response.sub,
      type: response.type as 'access' | 'refresh',
    };
  }
}
