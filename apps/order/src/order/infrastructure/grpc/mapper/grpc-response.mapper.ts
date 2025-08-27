import { PaymentMicroService } from '@app/common';
import { OrderDomain } from '../../../domain/order.domain';
import { PaymentDto } from '../../../usecase/dto/create-order.dto';
import { PaymentMethodEnum } from '../../../domain/payment.domain';

export class GrpcResponseMapper {
  constructor(
    private readonly response: PaymentMicroService.MakePaymentResponse,
  ) {}

  toDomain(order: OrderDomain, payment: PaymentDto): OrderDomain {
    order.setPayment({
      ...payment,
      ...this.response,
      paymentId: this.response.id,
      paymentMethod: this.parsePaymentMethod(this.response.paymentMethod),
    });

    return order;
  }

  private parsePaymentMethod(paymentMethod: string) {
    switch (paymentMethod) {
      case 'CreditCard':
        return PaymentMethodEnum.creditCard;
      case 'KakaoPay':
        return PaymentMethodEnum.kakaoPay;
      default:
        throw new Error('알수없는 결제방식입니다.');
    }
  }
}
