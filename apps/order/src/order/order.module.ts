import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateOrderUsecase } from './usecase/create-order.usecase';
import { StartDeliveryUsecase } from './usecase/start-delivery.usecase';
import { ORDER_OUTPUT_PORT } from './port/output/order.output-port';
import { OrderRepository } from './infrastructure/mongoose/repository/order.repository';
import { PAYMENT_OUTPUT_PORT } from './port/output/payment.output-port';
import { PaymentGrpc } from './infrastructure/grpc/payment.grpc';
import { PRODUCT_OUTPUT_PORT } from './port/output/product.output-port';
import { ProductGrpc } from './infrastructure/grpc/product.grpc';
import { UserGrpc } from './infrastructure/grpc/user.grpc';
import { USER_OUTPUT_PORT } from './port/output/user.output-port';
import {
  OrderDocument,
  OrderSchema,
} from './infrastructure/mongoose/schema/order.schema';
import { OrderController } from './infrastructure/framework/order.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrderDocument.name, schema: OrderSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [
    CreateOrderUsecase,
    StartDeliveryUsecase,
    { provide: ORDER_OUTPUT_PORT, useClass: OrderRepository },
    { provide: PAYMENT_OUTPUT_PORT, useClass: PaymentGrpc },
    { provide: PRODUCT_OUTPUT_PORT, useClass: ProductGrpc },
    { provide: USER_OUTPUT_PORT, useClass: UserGrpc },
  ],
})
export class OrderModule {}
