import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './application/payment.service';
import { PaymentController } from './adapter/input/payment.controller';
import { PaymentEntity } from './adapter/ouput/typeorm/entity/payment.entity';
import { TypeOrmAdapter } from './adapter/ouput/typeorm/typeorm.adapter';
import { GrpcAdapter } from './adapter/ouput/grpc/grpc.adapter';
import { PortOneAdapter } from './adapter/ouput/portone/portone.adapter';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity])],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    { provide: 'DatabaseOutputPort', useClass: TypeOrmAdapter },
    { provide: 'PaymentOutputPort', useClass: PortOneAdapter },
    { provide: 'NetworkOutputPort', useClass: GrpcAdapter },
  ],
})
export class PaymentModule {}
