/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export class GrpcInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const data = context.switchToRpc().getData();
    const ctx = context.switchToRpc().getContext();
    const meta = ctx.getMap();

    const targetClass = context.getClass().name;
    const targetHanlder = context.getHandler().name;

    const traceId = meta['trace-id'];
    const clientService = meta['client-service'];
    const clientClass = meta['client-class'];
    const clientMethod = meta['client-method'];

    const from = `${clientService}/${clientClass}/${clientMethod}`;
    const to = `${targetClass}/${targetHanlder}/`;

    const requestTimestamp = new Date();

    const recievedRequestLog = {
      type: 'RECIEVED_REQUEST',
      traceId,
      from,
      to,
      data,
      timestamp: requestTimestamp.toISOString(),
    };

    console.log(recievedRequestLog);

    return next.handle().pipe(
      map((data) => {
        const responseTimestamp = new Date();
        const responseTime = `${+responseTimestamp - +requestTimestamp}ms`;

        const responseLog = {
          type: 'RETURN_RESPONSE',
          traceId,
          from,
          to,
          data,
          responseTime,
          timestamp: responseTimestamp.toISOString(),
        };

        console.log(responseLog);

        return data;
      }),
    );
  }
}
