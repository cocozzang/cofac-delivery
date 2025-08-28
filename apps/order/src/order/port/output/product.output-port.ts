import { ProductDomain } from '../../domain/product.domain';

export const PRODUCT_OUTPUT_PORT = 'ProductOutputPort';

export interface ProductOutputPort {
  getProductsByIds(productIds: string[]): Promise<ProductDomain[]>;
}
