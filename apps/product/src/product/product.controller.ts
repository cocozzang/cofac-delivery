import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductMicroService } from '@app/common';

@Controller('product')
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
