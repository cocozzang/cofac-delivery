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
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }))
  async createOrder(
    @CurrentAuthrization() token: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.orderService.createOrder(token, createOrderDto);
  }
}
