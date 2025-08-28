import { UserMicroService } from '@app/common';
import { CustomerDomain } from '../../../domain/customer.domain';

export class GetUserInfoResponseMapper {
  constructor(
    private readonly response: UserMicroService.GetUserInfoResponse,
  ) {}

  toDomain() {
    return new CustomerDomain({
      userId: this.response.id,
      name: this.response.name,
      email: this.response.email,
    });
  }
}
