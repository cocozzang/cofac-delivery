import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { USER_SERVICE } from '@app/common';

@Injectable()
export class OrderService {
  constructor(
    @Inject(USER_SERVICE)
    private readonly userService: ClientProxy,
  ) {}

  async createOrder(token: string, createOrderDto: CreateOrderDto) {
    // 1) 사용자정보 가져오기
    const user = await this.getUserFromToken(token);

    return user;

    // 2) 상품정보 가져오기
    // 3) 총 금액 계산하기
    // 4) 금액 검증하기 - 최종결제금액
    // 5) 주문 생성하기
    // 6) 결제 시도하기
    // 7) 주문 상태 업데이트하기
    // 8) 결과 반환하기
  }

  async getUserFromToken(token: string) {
    console.log('get user from token msg');
    // 1) User MS : jwt token verifying

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response = await lastValueFrom(
      this.userService.send({ cmd: 'parse_bearer_token' }, { token }),
    );

    console.log(response);
    // 2) User MS : get user infomation
  }
}
