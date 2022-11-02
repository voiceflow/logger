import { ServerResponse } from 'node:http';

import { green, red, yellow } from 'colorette';

export const isWarnStatus = (res: ServerResponse) => res.statusCode >= 400 && res.statusCode < 499;
export const isErrorStatus = (res: ServerResponse) => res.statusCode >= 500 && res.statusCode < 599;
export const getColorizer = (res: ServerResponse) => {
  if (isWarnStatus(res)) return yellow;
  if (res.err || isErrorStatus(res)) return red;
  return green;
};
