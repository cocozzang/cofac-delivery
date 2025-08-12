import {
  Controller,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetProductsInfoDto } from './dto/get-products-info.dto';
import { RpcInterceptor } from '@app/common/interceptor/rpc.interceptor';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern({ cmd: 'create_sample_list' })
  createSampleList() {
    return this.productService.createSampleList();
  }

  @UseInterceptors(RpcInterceptor)
  @UsePipes(new ValidationPipe({ forbidNonWhitelisted: true, whitelist: true }))
  @MessagePattern({ cmd: 'get_products_info' })
  getProductsInfo(@Payload() data: GetProductsInfoDto) {
    return this.productService.getProductsInfo(data.productIds);
  }
}
