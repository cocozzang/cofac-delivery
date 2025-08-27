import { PaymentMethodEnum } from '../../domain/payment.domain';

export interface CreateOrderDto {
  userId: string;
  productIds: string[];
  address: AddressDto;
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
  payemtnName: string;
  cardNumber: string;
  expiryYear: string;
  expiryMonth: string;
  birthOrRegistration: string;
  passwordTwoDigits: string;
  amount: number;
}
