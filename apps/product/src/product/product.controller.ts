import { Controller, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { GrpcInterceptor, ProductMicroService } from '@app/common';

@UseInterceptors(GrpcInterceptor)
@Controller('product')
@ProductMicroService.ProductServiceControllerMethods()
export class ProductController
  implements ProductMicroService.ProductServiceController
{
  constructor(private readonly productService: ProductService) {}

  async createSamples() {
    const response = await this.productService.createSampleList();

    return { success: response };
  }

  async getProductsInfo(request: ProductMicroService.GetProductsInfoRequest) {
    const response = await this.productService.getProductsInfo(
      request.productIds,
    );

    return {
      products: response,
    };
  }
}
