import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum PaymentMethodEnum {
  creditCard = 'CreditCard',
  kakaoPay = 'KakaoPay',
}

@Schema({
  _id: false,
})
export class PaymentDocument {
  @Prop()
  paymentId: string;

  @Prop({
    type: String,
    enum: PaymentMethodEnum,
    default: PaymentMethodEnum.creditCard,
  })
  paymentMethod: PaymentMethodEnum;

  @Prop({ required: true })
  paymentName: string;

  @Prop({ required: true })
  amount: number;
}

export const PaymentSchema = SchemaFactory.createForClass(PaymentDocument);
