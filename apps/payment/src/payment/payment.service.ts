import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity, PaymentStatusEnum } from './entity/payment.entity';
import { Repository } from 'typeorm';
import { MakePaymentDto } from './dto/make-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
  ) {}

  async makePayment(payload: MakePaymentDto) {
    let paymentId: string | null = null;
    try {
      const result = await this.paymentRepository.save(payload);

      paymentId = result.id;

      await this.processPayment();

      await this.updatePaymentStatus(paymentId, PaymentStatusEnum.approved);

      // TODO: send notification

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
}
