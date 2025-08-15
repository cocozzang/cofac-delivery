/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  PAYMENT_SERVICE,
  PaymentMicroService,
  PRODUCT_SERVICE,
  ProductMicroService,
  USER_SERVICE,
  UserMicroService,
} from '@app/common';
import { PaymentCancelledException } from './exception/payment-cancelled.exception';
import { Product } from './entity/product.schema';
import { Customer } from './entity/customer.schema';
import { AddressDto } from './dto/address.dto';
import { Order, OrderStatusEnum } from './entity/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentDto } from './dto/payment.dto';
import { PaymentFiledException } from './exception/payment-failed.exception';

@Injectable()
export class OrderService implements OnModuleInit {
  userService: UserMicroService.UserServiceClient;
  productService: ProductMicroService.ProductServiceClient;
  paymentService: PaymentMicroService.PaymentServiceClient;

  constructor(
    @Inject(USER_SERVICE)
    private readonly userMicroService: ClientGrpc,
    @Inject(PRODUCT_SERVICE)
    private readonly productMicroService: ClientGrpc,
    @Inject(PAYMENT_SERVICE)
    private readonly paymentMicroService: ClientGrpc,
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
  ) {}

  onModuleInit() {
    this.userService =
      this.userMicroService.getService<UserMicroService.UserServiceClient>(
        UserMicroService.USER_SERVICE_NAME,
      );

    this.productService =
      this.productMicroService.getService<ProductMicroService.ProductServiceClient>(
        ProductMicroService.PRODUCT_SERVICE_NAME,
      );

    this.paymentService =
      this.paymentMicroService.getService<PaymentMicroService.PaymentServiceClient>(
        PaymentMicroService.PAYMENT_SERVICE_NAME,
      );
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    const { productIds, address, payment, meta } = createOrderDto;

    // 1) 사용자정보 가져오기
    const user = await this.getUserFromToken(meta.user.sub);

    // 2) 상품정보 가져오기
    const products = (await this.getProductsByIds(productIds)) as Product[];

    // 3) 총 금액 계산하기
    const totalAmount = this.calculateTotalAmount(products);

    // 4) 금액 검증하기 - 최종결제금액
    this.validatePaymentAmount(totalAmount, payment.amount);

    // 5) 주문 생성하기
    const customer = this.createCustomer(user);

    const order = await this.createNewOrder(
      customer,
      products,
      address,
      payment,
    );

    // 6) 결제 시도하기
    await this.processPayment(
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      order._id.toString(),
      // order._id.toHexString(), ObjectId객체안에 toHexString() 메서드가 왜 없을까?
      payment,
      user.email,
    );

    // 7) 결과 반환하기
    return this.orderModel.findById(order._id);
  }

  private async getUserFromToken(userId: string) {
    const userResponse = await lastValueFrom(
      this.userService.getUserinfo({ userId }),
    );

    return {
      id: userResponse.id,
      email: userResponse.email,
      name: userResponse.name,
      age: userResponse.age,
      profile: userResponse.profile,
    };
  }

  private async getProductsByIds(productIds: string[]) {
    const response = await lastValueFrom(
      this.productService.getProductsInfo({ productIds }),
    );

    return response.products.map((product: any) => ({
      productId: product.id,
      name: product.name,
      price: product.price,
    }));
  }

  private calculateTotalAmount(products: Product[]) {
    return products.reduce((acc, next) => acc + next.price, 0);
  }

  private validatePaymentAmount(clientTotal: number, serverTotal: number) {
    if (clientTotal !== serverTotal)
      throw new PaymentCancelledException(
        '결제하려는 상품의 금액이 변경되었습니다. ',
      );
  }

  private createCustomer(user: { id: string; email: string; name: string }) {
    return {
      userId: user.id,
      email: user.email,
      name: user.name,
    };
  }

  private createNewOrder(
    customer: Customer,
    products: Product[],
    deliveryAddress: AddressDto,
    payment: PaymentDto,
  ) {
    return this.orderModel.create({
      customer,
      products,
      deliveryAddress,
      payment,
    });
  }

  private async processPayment(
    orderId: string,
    paymentDto: PaymentDto,
    userEmail: string,
  ) {
    try {
      const response = await lastValueFrom(
        this.paymentService.makePayment({ ...paymentDto, userEmail, orderId }),
      );

      const isPaid = response.pyamentStatus === 'Approved';
      const orderStatus = isPaid
        ? OrderStatusEnum.paymentProcessed
        : OrderStatusEnum.paymentFailed;

      if (orderStatus === OrderStatusEnum.paymentFailed)
        throw new PaymentFiledException(response);

      await this.orderModel.findByIdAndUpdate(orderId, {
        status: OrderStatusEnum.paymentProcessed,
      });

      // return response;
    } catch (error) {
      if (error instanceof PaymentFiledException) {
        await this.orderModel.findByIdAndUpdate(orderId, {
          status: OrderStatusEnum.paymentFailed,
        });
      }
      throw error;
    }
  }

  changeOrderStatus(orderId: string, status: OrderStatusEnum) {
    return this.orderModel.findByIdAndUpdate(orderId, { status });
  }
}
