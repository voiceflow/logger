import pino, { Logger as PinoLogger, LoggerOptions } from '@voiceflow/pino';
import Prettifier from '@voiceflow/pino-pretty';
import expressPino from 'pino-http';

import { defaultConfigs, Level, LoggerConfig, MiddlewareVerbosity } from './constants';
import { debugSerializer, errorSerializer, fullSerializer, noSerializer, shortSerializer } from './utils';

class Logger {
  private config: LoggerConfig;

  private baseLogger: PinoLogger;

  private baseLoggerConfig: LoggerOptions;

  private middlewareLogger: expressPino.HttpLogger;

  private static getSerializer(verbosity?: null | MiddlewareVerbosity) {
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
  }

  constructor(config: LoggerConfig = defaultConfigs) {
    this.config = config;

    this.baseLoggerConfig = {
      base: null,
      level: config?.level || defaultConfigs.level!,
      serializers: { err: errorSerializer },
    };

    if (this.config?.pretty) {
      this.baseLoggerConfig.prettifier = Prettifier;
      this.baseLoggerConfig.prettyPrint = { levelFirst: true, translateTime: true };
    }

    this.baseLogger = pino(this.baseLoggerConfig);

    this.middlewareLogger = expressPino({
      logger: this.baseLogger,
      serializers: Logger.getSerializer(this.config.middlewareVerbosity),
      customLogLevel(res, err) {
        if (res.statusCode >= 400 && res.statusCode < 500) {
          return Level.WARN;
        }

        if (res.statusCode >= 500 || err) {
          return Level.ERROR;
        }

        return Level.INFO;
      },
      customSuccessMessage(res) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const reqPath = res.req.baseUrl + res.req.path;

        return `${res.statusCode} | ${reqPath} `;
      },
    });
  }

  trace(...params: [any, ...any[]]): void {
    this.baseLogger.trace(...params);
  }

  debug(...params: [any, ...any[]]): void {
    this.baseLogger.debug(...params);
  }

  info(...params: [any, ...any[]]): void {
    this.baseLogger.info(...params);
  }

  warn(...params: [any, ...any[]]): void {
    this.baseLogger.warn(...params);
  }

  error(...params: [any, ...any[]]): void {
    this.baseLogger.error(...params);
  }

  fatal(...params: [any, ...any[]]): void {
    this.baseLogger.fatal(...params);
  }

  logMiddleware(): expressPino.HttpLogger {
    return this.middlewareLogger;
  }
}

export default Logger;
