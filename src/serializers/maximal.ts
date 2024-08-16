import { MinimalSerializer } from './minimal';
import type { Serializer } from './serializer.interface';

export const MaximalSerializer: Serializer = {
  req: (req) => ({
    ...MinimalSerializer.req(req),
    headers: Object.fromEntries(Object.entries(req.headers).filter(([key]) => key === 'authorization')),
  }),
  res: (res) => ({
    ...MinimalSerializer.res(res),
    headers: res.headers,
  }),
  err: (err) => MinimalSerializer.err(err),
};
