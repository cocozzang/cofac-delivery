import { OrderDomain } from '../../domain/order.domain';
import { PaymentDto } from '../../usecase/dto/create-order.dto';

export const PAYMENT_OUTPUT_PORT = 'PaymentOutputPort';

export interface PaymentOutputPort {
  processPayment(order: OrderDomain, payment: PaymentDto): Promise<OrderDomain>;
}
