import { Logger } from '@voiceflow/pino';
import expressPino, { HttpLogger } from 'pino-http';

import { Level, MiddlewareVerbosity } from './constants';
import { debugSerializer, fullSerializer, noSerializer, shortSerializer } from './utils';

const getSerializer = (verbosity?: null | MiddlewareVerbosity) => {
  switch (verbosity) {
    case MiddlewareVerbosity.NONE:
      return noSerializer;
    case MiddlewareVerbosity.SHORT:
      return shortSerializer;
    case MiddlewareVerbosity.FULL:
      return fullSerializer;
    case MiddlewareVerbosity.DEBUG:
      return debugSerializer;
    default:
      return fullSerializer;
  }
};

const createMiddleware = ({
  logger,
  genReqId,
  verbosity,
}: {
  logger: Logger;
  genReqId?: () => string;
  verbosity?: null | MiddlewareVerbosity;
}): HttpLogger =>
  expressPino({
    logger,
    genReqId,
    serializers: getSerializer(verbosity),
    customLogLevel(res, err) {
      if (res.statusCode >= 500 || err) {
        return Level.ERROR;
      }

      if (res.statusCode >= 400) {
        if (res.statusCode === 404) {
          return Level.TRACE;
        }

        return Level.WARN;
      }

      return Level.INFO;
    },
    customSuccessMessage(res) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { baseUrl, path } = res.req;

      if (baseUrl || path) {
        return `${res.statusCode} | ${baseUrl ?? ''}${path ?? ''} `;
      }

      // This should never happen
      return `${res.statusCode} | (unknown path)`;
    },
  });

export default createMiddleware;
