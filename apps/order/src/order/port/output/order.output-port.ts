import { OrderDomain } from '../../domain/order.domain';

export const ORDER_OUTPUT_PORT = 'OrderOutputPort';

export interface OrderOutputPort {
  getOrder(orderId: string): Promise<OrderDomain>;

  createOrder(order: OrderDomain): Promise<OrderDomain>;

  updateOrder(order: OrderDomain): Promise<OrderDomain>;
}
