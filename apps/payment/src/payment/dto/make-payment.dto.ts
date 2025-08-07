import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PaymentMethodEnum } from '../entity/payment.entity';

export class MakePaymentDto {
  @IsString()
  @IsNotEmpty()
  paymentMethod: PaymentMethodEnum;

  @IsString()
  @IsNotEmpty()
  paymentName: string;

  @IsString()
  @IsNotEmpty()
  cardNumber: string;

  @IsString()
  @IsNotEmpty()
  expiryYear: string;

  @IsString()
  @IsNotEmpty()
  expiryMonth: string;

  @IsString()
  @IsNotEmpty()
  birthOrRegistration: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  passwordTwoDigits: string;

  @IsString()
  @IsNotEmpty()
  userEmail: string;
}
