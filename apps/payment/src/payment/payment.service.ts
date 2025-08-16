import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity, PaymentStatusEnum } from './entity/payment.entity';
import { Repository } from 'typeorm';
import { MakePaymentDto } from './dto/make-payment.dto';
import {
  constructMetadata,
  NOTIFICATION_SERVICE,
  NotificationMicroService,
} from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';

@Injectable()
export class PaymentService implements OnModuleInit {
  notificationService: NotificationMicroService.NotificationServiceClient;

  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notificationMicroService: ClientGrpc,
  ) {}

  onModuleInit() {
    this.notificationService =
      this.notificationMicroService.getService<NotificationMicroService.NotificationServiceClient>(
        NotificationMicroService.NOTIFICATION_SERVICE_NAME,
      );
  }

  async makePayment(payload: MakePaymentDto, metadata: Metadata) {
    let paymentId: string | null = null;
    try {
      const result = await this.paymentRepository.save(payload);

      paymentId = result.id;

      await this.processPayment();

      await this.updatePaymentStatus(paymentId, PaymentStatusEnum.approved);

      this.sendNotification(payload.orderId, payload.userEmail, metadata);

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

  sendNotification(orderId: string, to: string, metadata: Metadata) {
    const response = lastValueFrom(
      this.notificationService.sendPaymentNotification(
        { orderId, to },
        constructMetadata(PaymentService.name, 'sendNotification', metadata),
      ),
    );
  }
}
