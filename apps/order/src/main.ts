import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { OrderMicroService } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: OrderMicroService.protobufPackage,
      protoPath: join(process.cwd(), 'proto/order.proto'),
      url: configService.getOrThrow('GRPC_ORDER_URL'),
    },
  });

  await app.startAllMicroservices();
}

void bootstrap();
