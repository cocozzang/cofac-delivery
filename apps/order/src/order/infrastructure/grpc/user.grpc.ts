import { Inject, OnModuleInit } from '@nestjs/common';
import { UserOutputPort } from '../../port/output/user.output-port';
import { CustomerDomain } from '../../domain/customer.domain';
import { USER_SERVICE, UserMicroService } from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { GetUserInfoResponseMapper } from './mapper/get-user-info-response.mapper';

export class UserGrpc implements UserOutputPort, OnModuleInit {
  userClient: UserMicroService.UserServiceClient;
  constructor(
    @Inject(USER_SERVICE)
    private readonly userMicroservice: ClientGrpc,
  ) {}
  onModuleInit() {
    this.userClient =
      this.userMicroservice.getService<UserMicroService.UserServiceClient>(
        UserMicroService.USER_SERVICE_NAME,
      );
  }

  async getUserById(userId: string): Promise<CustomerDomain> {
    const response = await lastValueFrom(
      this.userClient.getUserinfo({ userId }),
    );

    return new GetUserInfoResponseMapper(response).toDomain();
  }
}
