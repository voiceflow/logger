import { SerializedError, SerializedRequest, SerializedResponse } from 'pino';

export const MinimalSerializer = {
  req: (req: SerializedRequest) => ({
    method: req.method,
    url: req.url,
    query: req.query,
    params: req.params,
    remoteAddress: req.remoteAddress,
    remotePort: req.remotePort,
  }),
  res: (res: SerializedResponse) => ({
    statusCode: res.statusCode,
  }),
  err: (err: SerializedError) => ({
    type: err.type,
    message: err.message,
    stack: err.stack,
  }),
};
