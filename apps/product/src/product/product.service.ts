import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ProductEntity } from './entity/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async getProductsInfo(productIds: string[]) {
    const products = await this.productRepository.find({
      where: {
        id: In(productIds),
      },
    });

    return products;
  }

  async createSampleList() {
    const data = [
      {
        name: '사과',
        price: 1000,
        description: '맛있는 청주사과',
        stock: 2,
      },
      {
        name: '메론',
        price: 2000,
        description: '머스크 메론',
        stock: 1,
      },
      {
        name: '수박',
        price: 3000,
        description: '씨없는 수박',
        stock: 10,
      },
      {
        name: '브로콜리',
        price: 2000,
        description: '맛없는 브로콜리',
        stock: 0,
      },
      {
        name: '바나나',
        price: 1500,
        description: '노란 바나나',
        stock: 3,
      },
      {
        name: '복숭아',
        price: 500,
        description: '빵디 꿀복숭아',
        stock: 12,
      },
      {
        name: '포도',
        price: 5000,
        description: '무농약 포도',
        stock: 2,
      },
      {
        name: '오렌지',
        price: 3000,
        description: '제주도 오렌지',
        stock: 1,
      },
    ];

    await this.productRepository.save(data);

    return true;
  }
}
