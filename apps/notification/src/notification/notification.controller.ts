import { Controller, InternalServerErrorException } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationMicroService } from '@app/common';

@Controller()
export class NotificationController
  implements NotificationMicroService.NotificationServiceController
{
  constructor(private readonly notificationService: NotificationService) {}

  async sendPaymentNotification(
    request: NotificationMicroService.SendPaymentNotificationRequest,
  ) {
    const response =
      await this.notificationService.sendPaymentNotification(request);

    if (!response) throw new InternalServerErrorException('transaction 실패');

    const res = response.toJSON();

    return {
      ...res,
      status: res.status,
    };

    //
    // return {
    //   from: response.from,
    //   to: response.to,
    //   subject: response.subject,
    //   content: response.content,
    //   status: response.status,
    // };
  }
}
