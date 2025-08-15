import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Notification,
  NotificationStatusEnum,
} from './entity/notification.schema';
import { Model } from 'mongoose';
import { SendPaymentNotificationDto } from './dto/send-payment-notification.dto';
import { ORDER_SERVICE, OrderMicroService } from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class NotificationService implements OnModuleInit {
  orderService: OrderMicroService.OrderServiceClient;

  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    @Inject(ORDER_SERVICE)
    private readonly orderMicroService: ClientGrpc,
  ) {}

  onModuleInit() {
    this.orderService =
      this.orderMicroService.getService<OrderMicroService.OrderServiceClient>(
        OrderMicroService.ORDER_SERVICE_NAME,
      );
  }

  async sendPaymentNotification(data: SendPaymentNotificationDto) {
    const notification = await this.createNotification(data.to);

    await this.sendEmail();

    await this.updateNotificationStatus(
      notification._id.toString(),
      NotificationStatusEnum.sent,
    );

    this.sendDeliveryStartedMessage(data.orderId);

    return this.notificationModel.findById(notification._id);
  }

  sendDeliveryStartedMessage(orderId: string) {
    this.orderService.deliveryStarted({ id: orderId });
  }

  async updateNotificationStatus(id: string, status: NotificationStatusEnum) {
    return this.notificationModel.findByIdAndUpdate(id, { status });
  }

  async sendEmail() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  async createNotification(to: string) {
    return this.notificationModel.create({
      from: 'admin@admin.com',
      to,
      subject: '배송이 시작되었습니다.',
      content: `${to}님, 주문하신 상품의 배송이 시작되었습니다.`,
    });
  }
}
