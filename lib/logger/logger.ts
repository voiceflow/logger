import Prettifier from '@voiceflow/pino-pretty';
import pino, { LoggerOptions, redactOptions } from 'pino';
import expressPino from 'pino-http';

import convertLevels from '@/lib/logger/levels';
import Caller from '@/lib/utils';

const defaultConfigs: vfLoggerConfig = {
  level: 'info',
  stackTrace: false,
  pretty: false,
  middlewareVerbosity: 'short',
};

export interface vfLoggerConfig {
  level?: string | null;
  stackTrace?: boolean;
  pretty?: boolean;
  redact?: string[] | redactOptions;
  middlewareVerbosity?: string | null; // none, short, full
}

const noSerializer = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  err: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  req: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  res: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  responseTime: () => {},
};

const shortSerializer = {
  err: pino.stdSerializers.err,
  req: (req) => {
    return {
      url: req.url,
    };
  },
  res: (res) => {
    return res.statusCode;
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  responseTime: () => {},
};

const fullSerializer = {
  err: pino.stdSerializers.err,
  req: pino.stdSerializers.req,
  res: pino.stdSerializers.res,
};

export default class Logger {
  config: vfLoggerConfig;

  baseLoggerConfig: LoggerOptions;

  baseLogger: pino.Logger;

  middlewareLogger: expressPino.HttpLogger;

  private static getSerializer(verbosity: string | null | undefined): any {
    switch (verbosity) {
      case 'none':
        return noSerializer;
      case 'short':
        return shortSerializer;
      case 'full':
        return fullSerializer;

      default:
        return fullSerializer;
    }
  }

  constructor(config?: vfLoggerConfig) {
    this.config = config || defaultConfigs;
    this.baseLoggerConfig = {
      level: convertLevels(config?.level || defaultConfigs.level),
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
      serializers: Logger.getSerializer(this.config.middlewareVerbosity),
      // Define a custom success message
      customSuccessMessage(res) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const reqPath = res.req.baseUrl + res.req.path;
        return `${res.statusCode} | ${reqPath} `;
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  trace(msg: any, ...params: any[]): void {
    this.baseLogger.trace(msg, ...params);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  debug(msg: any, ...params: any[]): void {
    this.baseLogger.debug(msg, ...params);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  info(msg: any, ...params: any[]): void {
    this.baseLogger.info(msg, ...params);
  }

  warn(...params: any[]): void {
    const logPayload = Caller.identify(params); // Full stack trace not needed for warnings
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.baseLogger.warn(...logPayload);
  }

  error(...params: any[]): void {
    const logPayload = Caller.identify(params, this.config?.stackTrace);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.baseLogger.error(...logPayload);
  }

  fatal(...params: any[]): void {
    const logPayload = Caller.identify(params, this.config?.stackTrace);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.baseLogger.fatal(...logPayload);
  }

  logMiddleware(): expressPino.HttpLogger {
    return this.middlewareLogger;
  }
}
