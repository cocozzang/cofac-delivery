import {
  Controller,
  InternalServerErrorException,
  UseInterceptors,
} from '@nestjs/common';
import { GrpcInterceptor, PaymentMicroService } from '@app/common';
import { PaymentMethodEnum } from '../../domain/payment.domain';
import { PaymentService } from '../../application/payment.service';

@UseInterceptors(GrpcInterceptor)
@Controller()
@PaymentMicroService.PaymentServiceControllerMethods()
export class PaymentController
  implements PaymentMicroService.PaymentServiceController
{
  constructor(private readonly paymentService: PaymentService) {}

  async makePayment(request: PaymentMicroService.MakePaymentRequest) {
    const response = await this.paymentService.makePayment({
      ...request,
      paymentMethod: request.paymentMethod as PaymentMethodEnum,
    });

    if (!response)
      throw new InternalServerErrorException('payment create transaction 실패');

    return {
      id: response.id,
      paymentStatus: response.paymentStatus,
      paymentMethod: response.paymentMethod,
    };
  }
}
