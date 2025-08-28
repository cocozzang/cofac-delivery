import { OrderDomain } from '../../../domain/order.domain';
import { ProductDomain } from '../../../domain/product.domain';
import { OrderDocument } from '../schema/order.schema';

export class OrderDocumentMapper {
  constructor(private readonly document: OrderDocument) {}

  toDomain(): OrderDomain {
    const order = new OrderDomain({
      customer: this.document.customer,
      products: this.document.products as ProductDomain[],
      deliveryAddress: this.document.deliveryAddress,
    });

    order.setId(this.document.id as string);
    order.setPayment(order.payment);

    return order;
  }
}
