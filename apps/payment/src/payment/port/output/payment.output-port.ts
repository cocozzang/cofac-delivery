import { PaymentDomain } from '../../domain/payment.domain';

export interface PaymentOuputPort {
  processPayment(payment: PaymentDomain): Promise<boolean>;
}
