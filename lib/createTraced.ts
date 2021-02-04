import pino, { Logger, LoggerOptions } from '@voiceflow/pino';
import { createNamespace } from 'cls-hooked';
import { nanoid } from 'nanoid';
import { HttpLogger } from 'pino-http';

import { MiddlewareVerbosity } from './constants';
import createMiddleware from './createMiddleware';

const TRACED_DATA = 'traced-data';
const DEFAULT_TRACE_LENGTH = 10;

const namespace = createNamespace('@voiceflow/logger');

const createTraced = ({
  options,
  verbosity,
  traceIDLength = DEFAULT_TRACE_LENGTH,
}: {
  options: LoggerOptions;
  verbosity?: null | MiddlewareVerbosity;
  traceIDLength?: number;
  namespaceName?: string;
}): {
  logger: Logger;
  middleware: HttpLogger;
} => {
  const setTracedData = (data: { logger: Logger; traceID: string }) => namespace.set(TRACED_DATA, data);

  const getTracedData = (): undefined | { logger: Logger; traceID: string } => namespace.get(TRACED_DATA);

  const logger = pino(options);

  const proxifiedLogger = new Proxy(logger, {
    get: (target, property, receiver) => Reflect.get(getTracedData()?.logger || target, property, receiver),
    has: (target, key) => Reflect.has(getTracedData()?.logger || target, key),
    apply: (target, thisArg, args) => Reflect.apply((getTracedData()?.logger || target) as any, thisArg, args),
    ownKeys: (target) => Reflect.ownKeys(getTracedData()?.logger || target),
    construct: (target, args) => Reflect.construct((getTracedData()?.logger || target) as any, args),
    getOwnPropertyDescriptor: (target, key) => Reflect.getOwnPropertyDescriptor(getTracedData()?.logger || target, key),
  });

  const middleware = createMiddleware({
    logger: options.prettifier ? logger : proxifiedLogger,
    verbosity,
    genReqId: () => getTracedData()?.traceID ?? nanoid(traceIDLength),
  });

  const tracedMiddleware: HttpLogger = (req, res, next) => {
    namespace.bindEmitter(req);
    namespace.bindEmitter(res);

    const traceID = nanoid(traceIDLength);
    const tracedLogger = options.prettifier ? logger : logger.child({ traceID });

    namespace.run(() => {
      setTracedData({ traceID, logger: tracedLogger });

      middleware(req, res, next);
    });
  };

  return {
    logger: proxifiedLogger,
    middleware: tracedMiddleware,
  };
};

export default createTraced;
