import { PaymentDomain } from 'apps/payment/src/payment/domain/payment.domain';
import { PaymentEntity } from '../entity/payment.entity';

export class PaymentEntityMapper {
  private readonly __brand = 'PaymentEntity';

  constructor(private readonly payment: PaymentEntity) {}

  toDomain() {
    const payment = new PaymentDomain({
      orderId: this.payment.orderId,
      paymentMethod: this.payment.paymentMethod,
      cardNumber: this.payment.cardNumber,
      expiryYear: this.payment.expiryYear,
      expiryMonth: this.payment.expiryMonth,
      birthOrRegistration: this.payment.birthOrRegistration,
      passwordTwoDigits: this.payment.passwordTwoDigits,
      amount: this.payment.amount,
      userEmail: this.payment.userEmail,
    });

    payment.assignId(this.payment.id);

    return payment;
  }
}
