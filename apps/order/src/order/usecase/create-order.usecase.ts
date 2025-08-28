import { Inject, Injectable } from '@nestjs/common';
import { OrderDomain } from '../domain/order.domain';
import {
  ORDER_OUTPUT_PORT,
  OrderOutputPort,
} from '../port/output/order.output-port';
import {
  PAYMENT_OUTPUT_PORT,
  PaymentOutputPort,
} from '../port/output/payment.output-port';
import {
  PRODUCT_OUTPUT_PORT,
  ProductOutputPort,
} from '../port/output/product.output-port';
import {
  USER_OUTPUT_PORT,
  UserOutputPort,
} from '../port/output/user.output-port';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class CreateOrderUsecase {
  constructor(
    @Inject(USER_OUTPUT_PORT)
    private readonly userOutputPort: UserOutputPort,
    @Inject(PRODUCT_OUTPUT_PORT)
    private readonly productOutputPort: ProductOutputPort,
    @Inject(ORDER_OUTPUT_PORT)
    private readonly orderOutputPort: OrderOutputPort,
    @Inject(PAYMENT_OUTPUT_PORT)
    private readonly paymentOutputPort: PaymentOutputPort,
  ) {}

  async execute(dto: CreateOrderDto) {
    // 1) User 값 가져온다 - User
    const user = await this.userOutputPort.getUserById(dto.userId);
    // 2) products 정보 가져온다 - Products
    const products = await this.productOutputPort.getProductsByIds(
      dto.productIds,
    );
    // 3) 주문을 생성한다 - Order
    const order = new OrderDomain({
      customer: user,
      products,
      deliveryAddress: dto.deliveryaddress,
    });
    // 4) 총액을 계싼한다 - Order
    order.calculateTotalAmount();

    // 5) 생성된 주문을 db에 저장 - Order
    const result = await this.orderOutputPort.createOrder(order);

    // 6) 생성된 주문 id 를 저장한다 - Order
    order.setId(result.id);

    // 7) 결제를 진행한다 - Payment
    try {
      const paymentResult = await this.paymentOutputPort.processPayment(
        order,
        dto.payment,
      );

      // 8) 결제 정보를 Order에 저장한다 - Order
      order.setPayment(paymentResult.payment);
      await this.orderOutputPort.updateOrder(order);

      return order;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // 9) 만약에 7번 이후의 프로세스가 실패하면 결제를 취소한다 - Order
      order.cancelOrder();
      await this.orderOutputPort.updateOrder(order);
      return order;
    }
  }
}
