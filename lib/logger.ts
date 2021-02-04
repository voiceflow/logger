import pino, { Logger as PinoLogger, LoggerOptions } from '@voiceflow/pino';
import prettifier from '@voiceflow/pino-pretty';
import { HttpLogger } from 'pino-http';

import { defaultConfigs, LoggerConfig } from './constants';
import createMiddleware from './createMiddleware';
import createTraced from './createTraced';
import { errorSerializer } from './utils';

class Logger {
  private logger: PinoLogger;

  private middleware: HttpLogger;

  constructor(config: LoggerConfig = defaultConfigs) {
    const options: LoggerOptions = {
      base: null,
      level: config?.level || defaultConfigs.level!,
      serializers: { err: errorSerializer },
    };

    if (config?.pretty) {
      options.prettifier = prettifier;
      options.prettyPrint = { levelFirst: true, translateTime: true };
    }

    if (config.withTraceID) {
      const traced = createTraced({ options, verbosity: config.middlewareVerbosity });

      this.logger = traced.logger;
      this.middleware = traced.middleware;
    } else {
      this.logger = pino(options);
      this.middleware = createMiddleware({ logger: this.logger, verbosity: config.middlewareVerbosity });
    }
  }

  trace(...params: [any, ...any[]]): void {
    this.logger.trace(...params);
  }

  debug(...params: [any, ...any[]]): void {
    this.logger.debug(...params);
  }

  info(...params: [any, ...any[]]): void {
    this.logger.info(...params);
  }

  warn(...params: [any, ...any[]]): void {
    this.logger.warn(...params);
  }

  error(...params: [any, ...any[]]): void {
    this.logger.error(...params);
  }

  fatal(...params: [any, ...any[]]): void {
    this.logger.fatal(...params);
  }

  logMiddleware(): HttpLogger {
    return this.middleware;
  }
}

export default Logger;
