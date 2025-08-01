import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Product, ProductSchema } from './product.schema';
import { Customer, CustomerSchema } from './customer.schema';
import {
  DeliveryAddress,
  DeliveryAddressSchema,
} from './deliverty-address.schema';
import { Payment, PaymentSchema } from './payment.schema';

export enum OrderStatusEnum {
  pending = 'Pending',
  pendingCancelled = 'PendingCancelled',
  paymentFailed = 'PaymentFailed',
  paymentProcessed = 'PaymentProcessed',
  deliveryStarted = 'DeliveryStarted',
  deleverDone = 'DeleverDone',
}

@Schema()
export class Order extends Document {
  @Prop({
    type: CustomerSchema,
    required: true,
  })
  customer: Customer;

  @Prop({
    type: ProductSchema,
    required: true,
  })
  products: Product[];

  @Prop({
    type: DeliveryAddressSchema,
    required: true,
  })
  deliveryAddress: DeliveryAddress;

  @Prop({
    enum: OrderStatusEnum,
    default: OrderStatusEnum.pending,
  })
  status: OrderStatusEnum;

  @Prop({
    type: PaymentSchema,
    required: true,
  })
  payment: Payment;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
