import { OrderDomain } from '../../domain/order.domain';
import { PaymentDto } from '../../usecase/dto/create-order.dto';

export interface PaymentOutputPort {
  processPayment(order: OrderDomain, payment: PaymentDto): Promise<OrderDomain>;
}
