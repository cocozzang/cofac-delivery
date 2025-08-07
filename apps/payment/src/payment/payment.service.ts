import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity, PaymentStatusEnum } from './entity/payment.entity';
import { Repository } from 'typeorm';
import { MakePaymentDto } from './dto/make-payment.dto';
import { NOTIFICATION_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationService: ClientProxy,
  ) {}

  async makePayment(payload: MakePaymentDto) {
    let paymentId: string | null = null;
    try {
      const result = await this.paymentRepository.save(payload);

      paymentId = result.id;

      await this.processPayment();

      await this.updatePaymentStatus(paymentId, PaymentStatusEnum.approved);

      // TODO: send notification
      this.sendNotification(payload.orderId, payload.userEmail);

      return this.paymentRepository.findOneBy({ id: paymentId });
    } catch (error) {
      if (paymentId) {
        await this.updatePaymentStatus(paymentId, PaymentStatusEnum.rejected);
      }

      throw error;
    }
  }

  async processPayment() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async updatePaymentStatus(id: string, status: PaymentStatusEnum) {
    await this.paymentRepository.update(
      {
        id,
      },
      { paymentStatus: status },
    );
  }

  sendNotification(orderId: string, to: string) {
    const response = lastValueFrom(
      this.notificationService.send(
        { cmd: 'send_payment_notification' },
        { orderId, to },
      ),
    );
  }
}
