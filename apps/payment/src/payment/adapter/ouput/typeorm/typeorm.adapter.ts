import { InjectRepository } from '@nestjs/typeorm';
import { PaymentDomain } from '../../../domain/payment.domain';
import { DatabaseOutputPort } from '../../../port/output/database.output-port';
import { Repository } from 'typeorm';
import { PaymentEntity } from './entity/payment.entity';
import { PaymentEntityMapper } from './mapper/payment-entity.mapper';
import { InternalServerErrorException } from '@nestjs/common';

export class TypeOrmAdapter implements DatabaseOutputPort {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
  ) {}

  async savePayment(payment: PaymentDomain): Promise<PaymentDomain> {
    const paymentEntity = this.paymentRepository.create(payment);

    const insertResult = await this.paymentRepository
      .createQueryBuilder()
      .insert()
      .into(PaymentEntity)
      .values(paymentEntity)
      .returning('*')
      .execute();

    const result = insertResult.raw as PaymentEntity[][0];

    return new PaymentEntityMapper(result).toDomain();
  }
  async updatePayment(payment: PaymentDomain): Promise<PaymentDomain> {
    await this.paymentRepository.update(payment.id, payment);

    const result = await this.paymentRepository.findOne({
      where: { id: payment.id },
    });

    if (!result)
      throw new InternalServerErrorException(
        '잘못된 payment id입니다. paymentDomain instance의 id가 assign 된 상태인지 확인하세요',
      );

    return new PaymentEntityMapper(result).toDomain();
  }
}
