import {
  BadRequestException,
  Controller,
  InternalServerErrorException,
  UseInterceptors,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { GrpcInterceptor, OrderMicroService } from '@app/common';
import { OrderStatusEnum } from './entity/order.schema';
import { PaymentMethodEnum } from './entity/payment.schema';
import { Metadata } from '@grpc/grpc-js';

@UseInterceptors(GrpcInterceptor)
@Controller()
@OrderMicroService.OrderServiceControllerMethods()
export class OrderController
  implements OrderMicroService.OrderServiceController
{
  constructor(private readonly orderService: OrderService) {}

  async createOrder(
    request: Required<OrderMicroService.CreateOrderRequest>,
    metadata: Metadata,
  ) {
    if (
      !request.adrees ||
      !request.meta ||
      !request.meta.user ||
      !request.payment
    )
      throw new BadRequestException('unvalide request');

    const response = await this.orderService.createOrder(
      {
        ...request,
        meta: {
          user: {
            sub: request.meta.user.sub,
            type: request.meta.user.type as 'access' | 'refresh',
          },
        },
        address: request.adrees,
        payment: {
          ...request.payment,
          paymentMethod: request.payment.paymentMethod as PaymentMethodEnum,
        },
      },
      metadata,
    );

    if (!response) throw new InternalServerErrorException('transaction 실패');

    return {
      customer: response.customer,
      products: response.products,
      deliverAddress: response.deliveryAddress,
      status: response.status,
      payment: response.payment,
    };
  }

  async deliveryStarted(request: OrderMicroService.DeliveryStartedRequest) {
    await this.orderService.changeOrderStatus(
      request.id,
      OrderStatusEnum.deliveryStarted,
    );
  }
}
