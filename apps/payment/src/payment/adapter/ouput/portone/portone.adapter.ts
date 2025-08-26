import { PaymentDomain } from '../../../domain/payment.domain';
import { PaymentOuputPort } from '../../../port/output/payment.output-port';

export class PortOneAdapter implements PaymentOuputPort {
  async processPayment(payment: PaymentDomain): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  }
}
