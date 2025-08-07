import {
  Controller,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MakePaymentDto } from './dto/make-payment.dto';
import { RpcInterceptor } from '@app/common/interceptor/rpc.interceptor';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseInterceptors(RpcInterceptor)
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }))
  @MessagePattern({ cmd: 'make_payment' })
  makePayment(@Payload() payload: MakePaymentDto) {
    return this.paymentService.makePayment(payload);
  }
}
