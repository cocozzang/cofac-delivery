import { ORDER_SERVICE, OrderMicroService, User } from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService implements OnModuleInit {
  orderService: OrderMicroService.OrderServiceClient;

  constructor(
    @Inject(ORDER_SERVICE)
    private readonly orderMicroService: ClientGrpc,
  ) {}
  onModuleInit() {
    this.orderService =
      this.orderMicroService.getService<OrderMicroService.OrderServiceClient>(
        OrderMicroService.ORDER_SERVICE_NAME,
      );
  }

  createOrder(user: User, createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder({
      ...createOrderDto,
      adrees: createOrderDto.address,
      meta: { user },
    });
  }
}
