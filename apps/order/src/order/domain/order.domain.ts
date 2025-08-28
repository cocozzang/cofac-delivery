import { CustomerDomain } from './customer.domain';
import { DeliveryAddressDomain } from './delivery-address.domain';
import { PaymentDomain } from './payment.domain';
import { ProductDomain } from './product.domain';

export enum OrderStatusEnum {
  pending = 'Pending',
  pendingCancelled = 'PendingCancelled',
  paymentFailed = 'PaymentFailed',
  paymentProcessed = 'PaymentProcessed',
  deliveryStarted = 'DeliveryStarted',
  deleverDone = 'DeleverDone',
}

export class OrderDomain {
  id: string;
  customer: CustomerDomain;
  products: ProductDomain[];
  deliveryAddress: DeliveryAddressDomain;
  status: OrderStatusEnum;
  payment: PaymentDomain;
  totalAmount: number;

  constructor(
    param: Pick<OrderDomain, 'customer' | 'products' | 'deliveryAddress'>,
  ) {
    this.customer = param.customer;
    this.products = param.products;
    this.deliveryAddress = param.deliveryAddress;
  }

  setId(id: string) {
    this.id = id;
  }

  setPayment(payment: PaymentDomain) {
    if (!this.id)
      throw new Error('id가 없는 주문에는 결제를 세팅할수 없습니다.');

    this.payment = payment;
  }

  calculateTotalAmount() {
    if (this.products.length === 0)
      throw new Error('주문시에는 상품이 하나 이상 필요합니다.');

    const total = this.products.reduce(
      (acc, product) => acc + product.price,
      0,
    );

    if (total <= 0) throw new Error('결제 총액은 0 보다 커야합니다.');

    this.totalAmount = total;
  }

  processPayment() {
    if (!this.id)
      throw new Error('결제를 진행하기 위해선 주문 ID가 필수입니다.');

    if (this.products.length === 0)
      throw new Error('결제를 진행하기 위해선 상품이 한개 이상 필요합니다.');

    if (!this.deliveryAddress)
      throw new Error('결제를 진행하기 위해선 배송 주소가 필요합니다.');

    if (!this.totalAmount)
      throw new Error('결제를 진행하기 위해선 결제 총액이 필수입니다.');

    if (this.status !== OrderStatusEnum.pending)
      throw new Error(
        'OrderStatusEnum.pending 상태에서만 결제를 진행할수있습니다.',
      );

    this.status = OrderStatusEnum.paymentProcessed;
  }

  cancelOrder() {
    this.status = OrderStatusEnum.pendingCancelled;
  }

  startDelivery() {
    if (this.status !== OrderStatusEnum.paymentProcessed)
      throw new Error(
        'OrderStatusEnum.paymentProcessed 상태에서만 배송을 시작 할 수 있습니다.',
      );

    this.status = OrderStatusEnum.deliveryStarted;
  }

  completeDelivery() {
    if (this.status !== OrderStatusEnum.deliveryStarted)
      throw new Error(
        'OrderStatusEnum.deliveryStarted 상태에서만 배송을 완료할 수 있습니다.',
      );

    this.status = OrderStatusEnum.deleverDone;
  }
}
