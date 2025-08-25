import {
  Controller,
  InternalServerErrorException,
  UseInterceptors,
} from '@nestjs/common';
import { Metadata } from '@grpc/grpc-js';
import { GrpcInterceptor, PaymentMicroService } from '@app/common';
import { PaymentMethodEnum } from '../../domain/payment.domain';
import { PaymentService } from '../../payment.service';

@UseInterceptors(GrpcInterceptor)
@Controller()
@PaymentMicroService.PaymentServiceControllerMethods()
export class PaymentController
  implements PaymentMicroService.PaymentServiceController
{
  constructor(private readonly paymentService: PaymentService) {}

  async makePayment(
    request: PaymentMicroService.MakePaymentRequest,
    metadata: Metadata,
  ) {
    const response = await this.paymentService.makePayment(
      {
        ...request,
        paymentMethod: request.paymentMethod as PaymentMethodEnum,
      },
      metadata,
    );

    if (!response)
      throw new InternalServerErrorException('payment create transaction 실패');

    return {
      id: response.id,
      pyamentStatus: response.paymentStatus,
      paymentMethod: response.paymentMethod,
    };
  }
}
