import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { catchError, map, Observable, throwError } from 'rxjs';

export class RpcInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data: unknown) => {
        const response = {
          status: 'success',
          data,
        };
        console.log(response);

        return response;
      }),
      catchError((error) => {
        const response = {
          status: 'error',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          error,
        };

        console.error(response);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return throwError(() => new RpcException(error));
      }),
    );
  }
}
