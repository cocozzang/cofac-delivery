import {
  constructMetadata,
  PRODUCT_SERVICE,
  ProductMicroService,
} from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ProductService implements OnModuleInit {
  productService: ProductMicroService.ProductServiceClient;
  constructor(
    @Inject(PRODUCT_SERVICE)
    private readonly productMicroService: ClientGrpc,
  ) {}

  onModuleInit() {
    this.productService =
      this.productMicroService.getService<ProductMicroService.ProductServiceClient>(
        ProductMicroService.PRODUCT_SERVICE_NAME,
      );
  }

  createSampleList() {
    return lastValueFrom(
      this.productService.createSamples(
        {},
        constructMetadata(ProductService.name, 'createSampleList'),
      ),
    );
  }
}
