import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum NotificationStatusEnum {
  pending = 'pending',
  sent = 'sent',
}

@Schema()
export class Notification extends Document {
  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  to: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  content: string;

  @Prop({
    enum: NotificationStatusEnum,
    defualt: NotificationStatusEnum.pending,
  })
  status: NotificationStatusEnum;
}
