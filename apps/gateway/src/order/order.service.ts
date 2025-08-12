import { ORDER_SERVICE, User, UserMeta } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_SERVICE)
    private readonly orderMicroService: ClientProxy,
  ) {}

  createOrder(user: User, createOrderDto: CreateOrderDto) {
    return lastValueFrom(
      this.orderMicroService.send<any, CreateOrderDto & UserMeta>(
        { cmd: 'create_order' },
        {
          ...createOrderDto,
          meta: { user },
        },
      ),
    );
  }
}
