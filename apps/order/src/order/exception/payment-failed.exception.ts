import { HttpException, HttpStatus } from '@nestjs/common';

export class PaymentFiledException extends HttpException {
  constructor(message: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    super(message, HttpStatus.BAD_REQUEST);
  }
}
