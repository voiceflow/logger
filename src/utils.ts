import { IncomingMessage, ServerResponse } from 'node:http';

import { green, red, yellow } from 'colorette';

export const isHealthRequest = (req: IncomingMessage & { originalUrl?: string }) => (req.originalUrl ?? req.url) === '/health';
export const isWarnResponse = (res: ServerResponse) => res.statusCode >= 400 && res.statusCode <= 499;
export const isErrorResponse = (res: ServerResponse) => res.err || (res.statusCode >= 500 && res.statusCode <= 599);
export const getColorizer = (res: ServerResponse) => {
  if (isWarnResponse(res)) return yellow;
  if (isErrorResponse(res)) return red;
  return green;
};
