import { PAYMENT_SERVICE, PaymentMicroService } from '@app/common';
import { OrderDomain, OrderStatusEnum } from '../../domain/order.domain';
import { PaymentOutputPort } from '../../port/output/payment.output-port';
import { PaymentDto } from '../../usecase/dto/create-order.dto';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { GrpcRequestMapper } from './mapper/grpc-request.mapper';
import { PaymentStatusEnum } from '../../domain/payment.domain';
import { PaymentFailedException } from '../../exception/payment-failed.exception';
import { GrpcResponseMapper } from './mapper/grpc-response.mapper';

export class PaymentGrpc implements PaymentOutputPort, OnModuleInit {
  paymentService: PaymentMicroService.PaymentServiceClient;

  constructor(
    @Inject(PAYMENT_SERVICE)
    private readonly paymentMicroservice: ClientGrpc,
  ) {}

  onModuleInit() {
    this.paymentService =
      this.paymentMicroservice.getService<PaymentMicroService.PaymentServiceClient>(
        PaymentMicroService.PAYMENT_SERVICE_NAME,
      );
  }

  async processPayment(
    order: OrderDomain,
    payment: PaymentDto,
  ): Promise<OrderDomain> {
    const response = await lastValueFrom(
      this.paymentService.makePayment(
        new GrpcRequestMapper(order).toMakePaymentRequest(payment),
      ),
    );

    const isPaid =
      response.paymentStatus === PaymentStatusEnum.approved.toString();

    const orderStatus = isPaid
      ? OrderStatusEnum.paymentProcessed
      : OrderStatusEnum.paymentFailed;

    if (orderStatus === OrderStatusEnum.paymentFailed)
      throw new PaymentFailedException(response);

    return new GrpcResponseMapper(response).toDomain(order, payment);
  }
}
