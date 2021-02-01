import { redactOptions } from '@voiceflow/pino';

export enum Level {
  INFO = 'info',
  WARN = 'warn',
  TRACE = 'trace',
  ERROR = 'error',
  FATAL = 'fatal',
}

export enum MiddlewareVerbosity {
  NONE = 'none',
  FULL = 'full',
  SHORT = 'short',
  DEBUG = 'debug',
}

export interface LoggerConfig {
  level?: Level | null;
  pretty?: boolean;
  redact?: string[] | redactOptions;
  middlewareVerbosity?: MiddlewareVerbosity | null;
}

export const defaultConfigs: LoggerConfig = {
  level: Level.INFO,
  pretty: false,
  middlewareVerbosity: MiddlewareVerbosity.SHORT,
};
