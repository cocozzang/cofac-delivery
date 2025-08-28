import { CustomerDomain } from '../../domain/customer.domain';

export const USER_OUTPUT_PORT = 'UserOutputPort';

export interface UserOutputPort {
  getUserById(userId: string): Promise<CustomerDomain>;
}
