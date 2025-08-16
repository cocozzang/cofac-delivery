/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { InterceptingCall } from '@grpc/grpc-js';

export const traceInterceptor = (service: string) => (options, nextCall) => {
  return new InterceptingCall(nextCall(options), {
    start: function (metadata, listener, next) {
      metadata.set('client-service', service);

      next(metadata, listener);
    },
  });
};
