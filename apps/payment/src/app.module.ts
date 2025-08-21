import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentModule } from './payment/payment.module';
import {
  NOTIFICATION_SERVICE,
  NotificationMicroService,
  traceInterceptor,
} from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        DB_URL: Joi.string().required(),
        TCP_PORT: Joi.number().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.getOrThrow('DB_URL'),
        autoLoadEntities: true,
        synchronize: true,
        ...(configService.get('NODE_ENV') === 'production' && {
          ssl: {
            rejectUnauthorized: false,
          },
        }),
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          name: NOTIFICATION_SERVICE,
          useFactory: (configService: ConfigService) => ({
            transport: Transport.GRPC,
            options: {
              channelOptions: {
                interceptors: [traceInterceptor('Payment')],
              },
              package: NotificationMicroService.protobufPackage,
              protoPath: join(process.cwd(), 'proto/notification.proto'),
              url: configService.getOrThrow('GRPC_NOTIFICATION_URL'),
            },
          }),
          inject: [ConfigService],
        },
      ],
      isGlobal: true,
    }),
    PaymentModule,
  ],
})
export class AppModule {}
