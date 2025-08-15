import { Controller, InternalServerErrorException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentMicroService } from '@app/common';
import { PaymentMethodEnum } from './entity/payment.entity';

@Controller()
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
      pyamentStatus: response.paymentStatus,
      paymentMethod: response.paymentMethod,
    };
  }
}
