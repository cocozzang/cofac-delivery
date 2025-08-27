import { PaymentMethodEnum } from '../../domain/payment.domain';

export interface CreateOrderDto {
  userId: string;
  productIds: string[];
  deliveryaddress: AddressDto;
  payment: PaymentDto;
}

export interface AddressDto {
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface PaymentDto {
  paymentMethod: PaymentMethodEnum;
  paymentName: string;
  cardNumber: string;
  expiryYear: string;
  expiryMonth: string;
  birthOrRegistration: string;
  passwordTwoDigits: string;
  amount: number;
}
