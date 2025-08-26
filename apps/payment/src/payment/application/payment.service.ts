import { PaymentDomain, PaymentMethodEnum } from '../domain/payment.domain';
import { DatabaseOutputPort } from '../port/output/database.output-port';
import { NetworkOuputPort } from '../port/output/network.output-port';
import { PaymentOuputPort } from '../port/output/payment.output-port';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
  constructor(
    @Inject('DatabaseOutputPort')
    private readonly databaseOuputPort: DatabaseOutputPort,
    @Inject('PaymentOutputPort')
    private readonly paymentOutputPort: PaymentOuputPort,
    @Inject('NetworkOutputPort')
    private readonly networkOutputPort: NetworkOuputPort,
  ) {}

  async makePayment(param: {
    orderId: string;
    userEmail: string;
    paymentMethod: PaymentMethodEnum;
    cardNumber: string;
    expiryYear: string;
    expiryMonth: string;
    birthOrRegistration: string;
    passwordTwoDigits: string;
    amount: number;
  }) {
    // 1) paymentDomain 인스턴스 생성
    const payment = new PaymentDomain(param);

    // 2) paymentDomain을 db에 저장한다.
    const result = await this.databaseOuputPort.savePayment(payment);

    // 3) db로 부터 반환받은 데이터의 id를 paymentDomain instance에 반영한다.
    payment.assignId(result.id);

    try {
      // 4) 결제를 실행한다. ( 실패시 reject 로직 )
      await this.paymentOutputPort.processPayment(payment);

      // 5) 결제 데이터를 업데이트한다 ( 실패시 reject 로직 )
      payment.processPayment();
      await this.databaseOuputPort.updatePayment(payment);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      payment.rejectPayment();
      await this.databaseOuputPort.updatePayment(payment);
      return payment;
    }

    // 6) 결제 성공시에 알림보내기 sendPaymentNotification gRPC 호출
    await this.networkOutputPort.sendPaymentNotification(
      param.orderId,
      param.userEmail,
    );

    return payment;
  }
}
