import {
  Controller,
  InternalServerErrorException,
  UseInterceptors,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { GrpcInterceptor, NotificationMicroService } from '@app/common';
import { Metadata } from '@grpc/grpc-js';

@UseInterceptors(GrpcInterceptor)
@Controller()
@NotificationMicroService.NotificationServiceControllerMethods()
export class NotificationController
  implements NotificationMicroService.NotificationServiceController
{
  constructor(private readonly notificationService: NotificationService) {}

  async sendPaymentNotification(
    request: NotificationMicroService.SendPaymentNotificationRequest,
    metadata: Metadata,
  ) {
    const response = await this.notificationService.sendPaymentNotification(
      request,
      metadata,
    );

    if (!response) throw new InternalServerErrorException('transaction 실패');

    const res = response.toJSON();

    return {
      ...res,
      status: res.status,
    };
  }
}
