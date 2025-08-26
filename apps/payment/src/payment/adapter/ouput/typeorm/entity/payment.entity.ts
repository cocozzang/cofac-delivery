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
    type: 'enum',
    enum: PaymentStatusEnum,
    default: PaymentStatusEnum.pending,
  })
  paymentStatus: PaymentStatusEnum;

  @Column({
    type: 'enum',
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
    type: 'enum',
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
