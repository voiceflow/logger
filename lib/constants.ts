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
  withTraceID?: boolean;
  middlewareVerbosity?: MiddlewareVerbosity | null;
}

export const defaultConfigs: LoggerConfig = {
  level: Level.INFO,
  pretty: false,
  withTraceID: true,
  middlewareVerbosity: MiddlewareVerbosity.SHORT,
};
