import { PaymentDomain } from '../../domain/payment.domain';

export interface DatabaseOutputPort {
  savePayment(payment: PaymentDomain): Promise<PaymentDomain>;

  updatePayment(payment: PaymentDomain): Promise<PaymentDomain>;
}
