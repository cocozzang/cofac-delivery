import { InjectModel } from '@nestjs/mongoose';
import { OrderDomain } from '../../../domain/order.domain';
import { OrderOutputPort } from '../../../port/output/order.output-port';
import { OrderDocument } from '../schema/order.schema';
import { Model } from 'mongoose';
import { OrderDocumentMapper } from '../mapper/order-document.mapper';

export class OrderRepository implements OrderOutputPort {
  constructor(
    @InjectModel(OrderDocument.name)
    private readonly orderRepository: Model<OrderDocument>,
  ) {}

  async getOrder(orderId: string): Promise<OrderDomain> {
    const order = await this.orderRepository.findById(orderId);

    if (!order)
      throw new Error('orderId에 해당하는 order가 존재하지 않습니다.');

    return new OrderDocumentMapper(order).toDomain();
  }
  async createOrder(order: OrderDomain): Promise<OrderDomain> {
    const result = await this.orderRepository.create(order);

    return new OrderDocumentMapper(result).toDomain();
  }
  async updateOrder(order: OrderDomain): Promise<OrderDomain> {
    const { id, ...rest } = order;

    const result = await this.orderRepository.findByIdAndUpdate(id, rest);

    if (!result)
      throw new Error('orderId에 해당하는 order가 존재하지 않습니다.');

    return new OrderDocumentMapper(result).toDomain();
  }
}
