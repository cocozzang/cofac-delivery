import { Controller, UseInterceptors } from '@nestjs/common';
import { Metadata } from '@grpc/grpc-js';
import { GrpcInterceptor, OrderMicroService } from '@app/common';
import { CreateOrderUsecase } from '../../usecase/create-order.usecase';
import { StartDeliveryUsecase } from '../../usecase/start-delivery.usecase';
import { CreateOrderRequestMapper } from './mapper/create-order-request.mapper';

@UseInterceptors(GrpcInterceptor)
@Controller()
@OrderMicroService.OrderServiceControllerMethods()
export class OrderController
  implements OrderMicroService.OrderServiceController
{
  constructor(
    private readonly createOrderUsecase: CreateOrderUsecase,
    private readonly startDeliveryUsecae: StartDeliveryUsecase,
  ) {}

  async deliveryStarted(request: OrderMicroService.DeliveryStartedRequest) {
    await this.startDeliveryUsecae.execute(request.id);
  }

  async createOrder(
    request: Required<OrderMicroService.CreateOrderRequest>,
    metadata: Metadata,
  ) {
    return this.createOrderUsecase.execute(
      new CreateOrderRequestMapper(request).toDomain(),
    );

    //   if (
    //     !request.adrees ||
    //     !request.meta ||
    //     !request.meta.user ||
    //     !request.payment
    //   )
    //     throw new BadRequestException('unvalide request');
    //
    //   const response = await this.orderService.createOrder(
    //     {
    //       ...request,
    //       meta: {
    //         user: {
    //           sub: request.meta.user.sub,
    //           type: request.meta.user.type as 'access' | 'refresh',
    //         },
    //       },
    //       address: request.adrees,
    //       payment: {
    //         ...request.payment,
    //         paymentMethod: request.payment.paymentMethod as PaymentMethodEnum,
    //       },
    //     },
    //     metadata,
    //   );
    //
    //   if (!response) throw new InternalServerErrorException('transaction 실패');
    //
    //   return {
    //     customer: response.customer,
    //     products: response.products,
    //     deliverAddress: response.deliveryAddress,
    //     status: response.status,
    //     payment: response.payment,
    //   };
    // }
  }
}
