import {
  Controller,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RpcInterceptor } from '@app/common';
import { SendPaymentNotificationDto } from './dto/send-payment-notification.dto';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseInterceptors(RpcInterceptor)
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }))
  @MessagePattern({ cmd: 'send_payment_notification' })
  async sendPaymentNotification(
    @Payload() payload: SendPaymentNotificationDto,
  ) {
    return this.notificationService.sendPaymentNotification(payload);
  }
}
