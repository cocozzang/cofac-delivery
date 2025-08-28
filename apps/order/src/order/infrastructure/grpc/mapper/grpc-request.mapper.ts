import { OrderDomain } from '../../../domain/order.domain';
import { PaymentDto } from '../../../usecase/dto/create-order.dto';

export class GrpcRequestMapper {
  constructor(private readonly order: OrderDomain) {}

  toMakePaymentRequest(payment: PaymentDto) {
    return {
      orderId: this.order.id,
      paymentMethod: payment.paymentMethod,
      paymentName: payment.paymentName,
      cardNumber: payment.cardNumber,
      expiryYear: payment.expiryMonth,
      expiryMonth: payment.expiryMonth,
      birthOrRegistration: payment.birthOrRegistration,
      amount: this.order.totalAmount,
      userEmail: this.order.customer.email,
      passwordTwoDigits: payment.passwordTwoDigits,
    };
  }
}
