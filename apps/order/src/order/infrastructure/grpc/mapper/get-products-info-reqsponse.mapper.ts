import { ProductMicroService } from '@app/common';
import { ProductDomain } from '../../../domain/product.domain';

export class GetProductsInfoResponseMapper {
  constructor(
    private readonly response: ProductMicroService.GetProductsInfoResponse,
  ) {}

  toDomain(): ProductDomain[] {
    return this.response.products.map(
      (product) =>
        new ProductDomain({
          productId: product.id,
          name: product.name,
          price: product.price,
        }),
    );
  }
}
