import { SerializedError, SerializedRequest, SerializedResponse } from 'pino';

// Must be a "type" to conform to Pino's serializer definition
/* eslint-disable-next-line @typescript-eslint/consistent-type-definitions */
export type Serializer = {
  req(req: SerializedRequest & { raw: SerializedRequest['raw'] & { originalUrl?: string } }): any;
  res(res: SerializedResponse): any;
  err(err: SerializedError): any;
};
