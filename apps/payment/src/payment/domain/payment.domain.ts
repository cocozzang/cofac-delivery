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

export class PaymentDomain {
  private readonly __brand = 'PaymentDomain';

  id: string;
  orderId: string;
  paymentStatus: PaymentStatusEnum;
  paymentMethod: PaymentMethodEnum;
  cardNumber: string;
  expiryYear: string;
  expiryMonth: string;
  birthOrRegistration: string;
  passwordTwoDigits: string;
  notificationStatus: NotificationStatusEnum;
  amount: number;
  userEmail: string;

  constructor(param: {
    orderId: string;
    paymentMethod: PaymentMethodEnum;
    cardNumber: string;
    expiryYear: string;
    expiryMonth: string;
    birthOrRegistration: string;
    passwordTwoDigits: string;
    amount: number;
    userEmail: string;
  }) {
    this.paymentStatus = PaymentStatusEnum.pending;
    this.notificationStatus = NotificationStatusEnum.pending;

    this.orderId = param.orderId;
    this.paymentMethod = param.paymentMethod;
    this.cardNumber = param.cardNumber;
    this.expiryYear = param.expiryYear;
    this.expiryMonth = param.expiryMonth;
    this.birthOrRegistration = param.birthOrRegistration;
    this.passwordTwoDigits = param.passwordTwoDigits;
    this.amount = param.amount;
    this.userEmail = param.userEmail;
  }

  assignId(id: string) {
    this.id = id;
  }

  processPayment() {
    if (!this.id) throw new Error('id가 없는 주문을 결제할 수 없습니다.');

    this.paymentStatus = PaymentStatusEnum.approved;
  }

  rejectPayment() {
    if (!this.id) throw new Error('id가 없는 주문을 결제 거절 할 수 없습니다.');

    this.paymentStatus = PaymentStatusEnum.rejected;
  }

  sendNotification() {
    this.notificationStatus = NotificationStatusEnum.sent;
  }
}
