import type { Serializer } from './serializer.interface';

export const MinimalSerializer: Serializer = {
  req: (req) => ({
    method: req.method,
    url: req.raw.originalUrl ?? req.url,
    query: req.query,
    params: req.params,
    remoteAddress: req.remoteAddress,
    remotePort: req.remotePort,
  }),
  res: (res) => ({
    statusCode: res.statusCode,
  }),
  err: (err) => ({
    type: err.type,
    message: err.message,
    stack: err.stack,
  }),
};
