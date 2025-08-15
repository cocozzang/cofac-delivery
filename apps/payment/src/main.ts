import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PaymentMicroService } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: PaymentMicroService.protobufPackage,
      protoPath: join(process.cwd(), 'proto/payment.proto'),
      url: configService.getOrThrow('GRPC_PAYMENT_URL'),
    },
  });

  await app.startAllMicroservices();
}

void bootstrap();
