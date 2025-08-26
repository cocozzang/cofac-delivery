import { Inject, OnModuleInit } from '@nestjs/common';
import { NetworkOuputPort } from '../../../port/output/network.output-port';
import { NOTIFICATION_SERVICE, NotificationMicroService } from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentEntity } from '../typeorm/entity/payment.entity';
import { lastValueFrom } from 'rxjs';

export class GrpcAdapter implements NetworkOuputPort, OnModuleInit {
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

  async sendPaymentNotification(orderId: string, to: string) {
    await lastValueFrom(
      this.notificationService.sendPaymentNotification({ to, orderId }),
    );
  }
}
