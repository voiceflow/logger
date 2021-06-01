import pino, { Logger as PinoLogger, LoggerOptions } from '@voiceflow/pino';
import prettifier from '@voiceflow/pino-pretty';
import { HttpLogger } from 'pino-http';

import { LogLevel } from '..';
import { defaultConfigs, LoggerConfig } from './constants';
import createMiddleware from './createMiddleware';
import createTraced from './createTraced';
import { errorSerializer } from './utils';

class Logger {
  private logger: PinoLogger;

  private middleware: HttpLogger;

  constructor(config: LoggerConfig = defaultConfigs) {
    const cfg = Object.assign(defaultConfigs, config);

    const options: LoggerOptions = {
      base: null,
      level: cfg.level! || LogLevel.ERROR,
      serializers: { err: errorSerializer },
    };

    if (cfg?.pretty) {
      options.prettifier = prettifier;
      options.prettyPrint = { levelFirst: true, translateTime: true };
    }

    if (cfg.withTraceID) {
      const traced = createTraced({ options, verbosity: cfg.middlewareVerbosity });

      this.logger = traced.logger;
      this.middleware = traced.middleware;
    } else {
      this.logger = pino(options);
      this.middleware = createMiddleware({ logger: this.logger, verbosity: cfg.middlewareVerbosity });
    }
  }

  trace(message: any): void {
    this.logger.trace(message);
  }

  debug(message: any): void {
    this.logger.debug(message);
  }

  info(message: any): void {
    this.logger.info(message);
  }

  warn(message: any): void {
    this.logger.warn(message);
  }

  error(message: any): void {
    this.logger.error(message);
  }

  fatal(message: any): void {
    this.logger.fatal(message);
  }

  logMiddleware(): HttpLogger {
    return this.middleware;
  }
}

export default Logger;
