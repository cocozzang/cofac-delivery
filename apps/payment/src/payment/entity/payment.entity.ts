import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum PaymentStatusEnum {
  pending = 'Pending',
  rejected = 'Rejected',
  approved = 'Approved',
}

export enum PaymentMethodEnum {
  creditCard = 'CreditCard',
  kakao = 'Kakao',
}

export enum NotificationStatusEnum {
  pending = 'pending',
  sent = 'sent',
}

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
}
