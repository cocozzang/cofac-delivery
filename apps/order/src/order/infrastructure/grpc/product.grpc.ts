import { Inject, OnModuleInit } from '@nestjs/common';
import { ProductOutputPort } from '../../port/output/product.output-port';
import { PRODUCT_SERVICE, ProductMicroService } from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ProductDomain } from '../../domain/product.domain';
import { lastValueFrom } from 'rxjs';
import { GetProductsInfoResponseMapper } from './mapper/get-products-info-reqsponse.mapper';

export class ProductGrpc implements ProductOutputPort, OnModuleInit {
  productClient: ProductMicroService.ProductServiceClient;

  constructor(
    @Inject(PRODUCT_SERVICE)
    private readonly productMicroservice: ClientGrpc,
  ) {}

  onModuleInit() {
    this.productClient =
      this.productMicroservice.getService<ProductMicroService.ProductServiceClient>(
        ProductMicroService.PRODUCT_SERVICE_NAME,
      );
  }

  async getProductsByIds(productIds: string[]): Promise<ProductDomain[]> {
    const response = await lastValueFrom(
      this.productClient.getProductsInfo({
        productIds,
      }),
    );

    return new GetProductsInfoResponseMapper(response).toDomain();
  }
}
