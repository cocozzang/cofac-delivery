export enum PaymentMethodEnum {
  creditCard = 'CreditCard',
  kakaoPay = 'KakaoPay',
}

export class PaymentDomain {
  paymentId: string;
  paymentMethod: PaymentMethodEnum;
  paymentName: string;
  amount: number;

  constructor(param: PaymentDomain) {
    this.paymentId = param.paymentId;
    this.paymentMethod = param.paymentMethod;
    this.paymentName = param.paymentName;
    this.amount = param.amount;
  }
}
