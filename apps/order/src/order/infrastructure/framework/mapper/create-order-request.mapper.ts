import { OrderMicroService } from '@app/common';
import {
  AddressDto,
  CreateOrderDto,
  PaymentDto,
} from '../../../usecase/dto/create-order.dto';
import { CreateOrderRequest_Payment } from '@app/common/grpc/proto/order';
import { PaymentMethodEnum } from 'apps/payment/src/payment/domain/payment.domain';

export class CreateOrderRequestMapper {
  constructor(private readonly request: OrderMicroService.CreateOrderRequest) {}

  toDomain(): CreateOrderDto {
    return {
      userId: this.request.meta?.user?.sub as string,
      productIds: this.request.productIds,
      deliveryaddress: this.request.address as AddressDto,
      payment: {
        ...this.request.payment,
        paymentMethod: this.parsePaymentMethod(
          (this.request.payment as CreateOrderRequest_Payment).paymentMethod,
        ),
      } as PaymentDto,
    };
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
