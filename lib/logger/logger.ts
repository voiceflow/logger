import Prettifier from '@voiceflow/pino-pretty';
import expressPino from 'express-pino-logger';
import pino, { Level, LoggerOptions, redactOptions } from 'pino';

import Caller from '@/lib/utils';

const defaultConfigs: vfLoggerConfig = {
  level: 'info',
  stackTrace: false,
  pretty: false,
};

export interface vfLoggerConfig {
  level?: Level;
  stackTrace?: boolean;
  pretty?: boolean;
  redact?: string[] | redactOptions;
}

export default class Logger {
  config: vfLoggerConfig;

  baseLoggerConfig: LoggerOptions;

  baseLogger: pino.Logger;

  middlewareLogger: expressPino.HttpLogger;

  constructor(config?: vfLoggerConfig) {
    this.config = config || defaultConfigs;
    this.baseLoggerConfig = {
      level: config?.level || defaultConfigs.level,
      base: null,
    };

    if (this.config?.pretty) {
      this.baseLoggerConfig.prettifier = Prettifier;
      this.baseLoggerConfig.prettyPrint = {
        levelFirst: true,
        translateTime: true,
      };
    }

    this.baseLogger = pino(this.baseLoggerConfig);
    this.middlewareLogger = expressPino({
      logger: this.baseLogger, // Use the instantiated base logger
      // Define a custom logger level
      customLogLevel(res, err) {
        if (res.statusCode >= 400 && res.statusCode < 500) {
          return 'warn';
        }
        if (res.statusCode >= 500 || err) {
          return 'error';
        }
        return 'info';
      },

      // Define a custom success message
      customSuccessMessage(res) {
        if (res.statusCode === 404) {
          return 'resource not found';
        }
        return 'request completed';
      },
    });
  }

  trace(msg: string, ...params: any[]): void {
    this.baseLogger.trace(msg, ...params);
  }

  debug(msg: string, ...params: any[]): void {
    this.baseLogger.debug(msg, ...params);
  }

  info(msg: string, ...params: any[]): void {
    this.baseLogger.info(msg, ...params);
  }

  warn(...params: any[]): void {
    const logPayload = Caller.identify(params); // Full stack trace not needed for warnings
    this.baseLogger.warn(logPayload[0], logPayload[1]);
  }

  error(...params: any[]): void {
    const logPayload = Caller.identify(params, this.config?.stackTrace);
    this.baseLogger.error(logPayload[0], logPayload[1]);
  }

  fatal(...params: any[]): void {
    const logPayload = Caller.identify(params, this.config?.stackTrace);
    this.baseLogger.fatal(logPayload[0], logPayload[1]);
  }

  logMiddleware(): expressPino.HttpLogger {
    return this.middlewareLogger;
  }
}
