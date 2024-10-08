/* eslint-disable sonarjs/no-nested-template-literals */
import type { IncomingMessage } from 'node:http';

import { gray, white } from 'colorette';
import pinoHttp, { Options } from 'pino-http';
import { match } from 'ts-pattern';

import { createDetailedConfig } from './detailed.logger';
import { createInlineConfig } from './inline.logger';
import { createJSONConfig } from './json.logger';
import { LogFormat } from './log-format.enum';
import { LogLevel } from './log-level.enum';
import { LoggerOptions } from './logger-options.interface';
import { getColorizer, isErrorResponse, isHealthRequest, isWarnResponse } from './utils';

export const createHTTPConfig = ({ format, level }: LoggerOptions): Options => ({
  customLogLevel: (req, res) => {
    if (isWarnResponse(res)) return LogLevel.WARN;
    if (isErrorResponse(res)) return LogLevel.ERROR;
    if (isHealthRequest(req)) return LogLevel.TRACE;
    return LogLevel.DEBUG;
  },
  wrapSerializers: true,

  ...match<LogFormat, Options<IncomingMessage & { originalUrl?: string }>>(format)
    .with(LogFormat.INLINE, () => ({
      customSuccessMessage: (req, res) =>
        `${getColorizer(res)(`(${res.statusCode})`)} ${white(`${req.method} ${req.originalUrl ?? req.url}`)} ${gray(
          `(${req.socket.remoteAddress}:${req.socket.remotePort})`
        )}`,
      customErrorMessage: (req, res) =>
        `${getColorizer(res)(`(${res.statusCode})`)} ${white(`${req.method} ${req.originalUrl ?? req.url}`)} ${gray(
          `(${req.socket.remoteAddress}:${req.socket.remotePort})`
        )} - ${res.err?.message}`,
      ...createInlineConfig(level),
    }))
    .with(LogFormat.DETAILED, () => createDetailedConfig(level))
    .otherwise(() => createJSONConfig(level)),
});

export const createHTTPLogger = (options: LoggerOptions) => pinoHttp(createHTTPConfig(options));
