import {
  NotificationStatusEnum,
  PaymentMethodEnum,
  PaymentStatusEnum,
} from 'apps/payment/src/payment/domain/payment.domain';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'payment' })
export class PaymentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    enum: PaymentStatusEnum,
    default: PaymentStatusEnum.pending,
  })
  paymentStatus: PaymentStatusEnum;

  @Column({
    enum: PaymentMethodEnum,
    default: PaymentMethodEnum.creditCard,
  })
  paymentMethod: PaymentMethodEnum;

  @Column()
  cardNumber: string;

  @Column()
  expiryYear: string;

  @Column()
  expiryMonth: string;

  @Column()
  birthOrRegistration: string;

  @Column()
  passwordTwoDigits: string;

  @Column({
    enum: NotificationStatusEnum,
    default: NotificationStatusEnum.pending,
  })
  notificationStatus: NotificationStatusEnum;

  @Column()
  orderId: string;

  @Column()
  amount: number;

  @Column()
  userEmail: string;
}
