import { OrderOutputPort } from '../port/output/order.output-port';

export class StartDeliveryUsecase {
  constructor(private readonly orderOuputPort: OrderOutputPort) {}

  async execute(orderId: string) {
    const order = await this.orderOuputPort.getOrder(orderId);

    order.startDelivery();

    await this.orderOuputPort.updateOrder(order);

    return order;
  }
}
