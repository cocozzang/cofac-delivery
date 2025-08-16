import {
  Controller,
  InternalServerErrorException,
  UseInterceptors,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { GrpcInterceptor, PaymentMicroService } from '@app/common';
import { PaymentMethodEnum } from './entity/payment.entity';
import { Metadata } from '@grpc/grpc-js';

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
