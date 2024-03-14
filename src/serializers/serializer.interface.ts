import { SerializedError, SerializedRequest, SerializedResponse } from 'pino';

export interface Serializer {
  req: (req: SerializedRequest & { raw: SerializedRequest['raw'] & { originalUrl?: string } }) => any;
  res: (res: SerializedResponse) => any;
  err: (err: SerializedError) => any;
}
