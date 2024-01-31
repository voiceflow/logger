import { SerializedError, SerializedRequest, SerializedResponse } from 'pino';

export const MaximalSerializer = {
  req: (req: SerializedRequest) => ({
    id: req.id,
    method: req.method,
    url: req.url,
    query: req.query,
    params: req.params,
    headers: Object.fromEntries(Object.entries(req.headers).filter(([key]) => key === 'authorization')),
    remoteAddress: req.remoteAddress,
    remotePort: req.remotePort,
  }),
  res: (res: SerializedResponse) => ({
    statusCode: res.statusCode,
    headers: res.headers,
  }),
  err: (err: SerializedError) => ({
    type: err.type,
    message: err.message,
    stack: err.stack,
  }),
};
