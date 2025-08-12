import {
  Controller,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { RpcInterceptor } from '@app/common';
import { OrderStatusEnum } from './entity/order.schema';
import { DeliveryStartedDto } from './dto/delivery-started.dto';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseInterceptors(RpcInterceptor)
  @MessagePattern({ cmd: 'create_order' })
  @UsePipes(new ValidationPipe())
  async createOrder(@Payload() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @UseInterceptors(RpcInterceptor)
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }))
  @EventPattern({ cmd: 'delivery_started' })
  async deliveryStarted(@Payload() payload: DeliveryStartedDto) {
    await this.orderService.changeOrderStatus(
      payload.id,
      OrderStatusEnum.deliveryStarted,
    );
  }
}
