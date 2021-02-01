/* eslint-disable @typescript-eslint/no-empty-function */

import { SerializedError, SerializedRequest, SerializedResponse, stdSerializers } from '@voiceflow/pino';

export const errorSerializer = (err: any): SerializedError => {
  const lines = err.stack?.split('\n').filter((str) => !str.match(/node_modules\/|\\|\\\\(pino|@voiceflow\/|\\|\\\\logger)/));

  err.stack = lines?.join('');

  if (err.isAxiosError) {
    return stdSerializers.err(err.toJSON?.() ?? err);
  }

  return stdSerializers.err(err?.isAxiosError);
};

export const noSerializer = {
  err: (): void => {},
  req: (): void => {},
  res: (): void => {},
  responseTime: (): void => {},
};

export const shortSerializer = {
  err: errorSerializer,
  req: ({ url }: SerializedRequest): { url: string } => ({ url }),
  res: ({ statusCode }: SerializedResponse): number => statusCode,
  responseTime: (): void => {},
};

export const fullSerializer = {
  err: errorSerializer,
  req: stdSerializers.req,
  res: stdSerializers.res,
};

export const debugSerializer = {
  err: errorSerializer,
  req(req: SerializedRequest & { body: unknown; raw: { body: unknown } }): SerializedRequest {
    req.body = req.raw.body;

    return req;
  },
  res(res: SerializedRequest & { body: unknown; raw: { body: unknown } }): SerializedRequest {
    res.body = res.raw.body;

    return res;
  },
};
