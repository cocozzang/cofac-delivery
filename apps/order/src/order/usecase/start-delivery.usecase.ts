import { Inject, Injectable } from '@nestjs/common';
import {
  ORDER_OUTPUT_PORT,
  OrderOutputPort,
} from '../port/output/order.output-port';

@Injectable()
export class StartDeliveryUsecase {
  constructor(
    @Inject(ORDER_OUTPUT_PORT)
    private readonly orderOuputPort: OrderOutputPort,
  ) {}

  async execute(orderId: string) {
    const order = await this.orderOuputPort.getOrder(orderId);

    order.startDelivery();

    await this.orderOuputPort.updateOrder(order);

    return order;
  }
}
