import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CurrentAuthrization } from 'apps/user/src/auth/decorator/current-authorization.decorator';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  // @UsePipes(ValidationPipe)
  async createOrder(
    @CurrentAuthrization() token: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    console.log(
      `${new Date(Date.now()).toISOString()} : request has been sent`,
    );
    return this.orderService.createOrder(token, createOrderDto);
  }
}
