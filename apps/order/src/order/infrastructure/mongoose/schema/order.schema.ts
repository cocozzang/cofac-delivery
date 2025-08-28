import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { ProductDocument, ProductSchema } from './product.schema';
import { CustomerDocument, CustomerSchema } from './customer.schema';
import {
  DeliveryAddressDocument,
  DeliveryAddressSchema,
} from './deliverty-address.schema';
import { PaymentDocument, PaymentSchema } from './payment.schema';

export enum OrderStatusEnum {
  pending = 'Pending',
  pendingCancelled = 'PendingCancelled',
  paymentFailed = 'PaymentFailed',
  paymentProcessed = 'PaymentProcessed',
  deliveryStarted = 'DeliveryStarted',
  deleverDone = 'DeleverDone',
}

@Schema()
export class OrderDocument extends Document<ObjectId> {
  @Prop({
    type: CustomerSchema,
    required: true,
  })
  customer: CustomerDocument;

  @Prop({
    type: [ProductSchema],
    required: true,
  })
  products: ProductDocument[];

  @Prop({
    type: DeliveryAddressSchema,
    required: true,
  })
  deliveryAddress: DeliveryAddressDocument;

  @Prop({
    type: String,
    enum: OrderStatusEnum,
    default: OrderStatusEnum.pending,
  })
  status: OrderStatusEnum;

  @Prop({
    type: PaymentSchema,
  })
  payment: PaymentDocument;
}

export const OrderSchema = SchemaFactory.createForClass(OrderDocument);
