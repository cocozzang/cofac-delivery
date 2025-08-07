import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CurrentAuthrization } from 'apps/user/src/auth/decorator/current-authorization.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { EventPattern, Payload } from '@nestjs/microservices';
import { RpcInterceptor } from '@app/common';
import { OrderStatusEnum } from './entity/order.schema';
import { DeliveryStartedDto } from './dto/delivery-started.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }))
  async createOrder(
    @CurrentAuthrization() token: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.createOrder(token, createOrderDto);
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
