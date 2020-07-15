import Prettifier from '@voiceflow/pino-pretty';
import expressPino from 'express-pino-logger';
import pino from 'pino';

import Caller from '@/lib/utils';

const defaultConfigs = {
  level: 'info',
  stackTrace: false,
  pretty: false,
};

export default class Logger {
  constructor(config) {
    this.config = config != null ? config : defaultConfigs;
    this.baseLoggerConfig = {
      level: this.config.level || defaultConfigs.level,
      base: null,
    };

    if (this.config.pretty) {
      this.baseLoggerConfig.prettifier = Prettifier;
      this.baseLoggerConfig.prettyPrint = {
        levelFirst: true,
        translateTime: true,
      };
    }

    this.baseLogger = pino(this.baseLoggerConfig);
    this.middlewareLogger = expressPino({
      logger: this.baseLogger, // Use the instantiated base logger
    });
  }

  trace(...params: any[]): void {
    this.baseLogger.trace(...params);
  }

  debug(...params: any[]): void {
    this.baseLogger.debug(...params);
  }

  info(...params: any[]): void {
    this.baseLogger.info(...params);
  }

  warn(...params: any[]): void {
    const logPayload = Caller.identify(params); // Full stack trace not needed for warnings
    this.baseLogger.warn(...logPayload);
  }

  error(...params: any[]): void {
    const logPayload = Caller.identify(params, this.config.stackTrace);
    this.baseLogger.error(...logPayload);
  }

  fatal(...params: any[]): void {
    const logPayload = Caller.identify(params, this.config.stackTrace);
    this.baseLogger.fatal(...logPayload);
  }
}
