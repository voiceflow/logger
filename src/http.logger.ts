/* eslint-disable sonarjs/no-nested-template-literals */
import { white } from 'colorette';
import pinoHttp, { Options } from 'pino-http';
import { match } from 'ts-pattern';

import { createDetailedConfig } from './detailed.logger';
import { createInlineConfig } from './inline.logger';
import { createJSONConfig } from './json.logger';
import { LogFormat } from './log-format.enum';
import { LogLevel } from './log-level.enum';
import { LoggerOptions } from './logger-options.interface';
import { getColorizer, isErrorStatus, isWarnStatus } from './utils';

export const createHTTPConfig = ({ format, level }: LoggerOptions): Options => ({
  customLogLevel: (_req, res) => {
    if (isWarnStatus(res)) return LogLevel.WARN;
    if (res.err || isErrorStatus(res)) return LogLevel.ERROR;
    return LogLevel.INFO;
  },

  ...match<LogFormat, Options>(format)
    .with(LogFormat.INLINE, () => ({
      customSuccessMessage: (req, res) => `${getColorizer(res)(`(${res.statusCode})`)} ${white(`${req.method} ${req.url}`)}`,
      customErrorMessage: (req, res) => `${getColorizer(res)(`(${res.statusCode})`)} ${white(`${req.method} ${req.url} -`)} ${res.err?.message}`,
      ...createInlineConfig(level),
    }))
    .with(LogFormat.DETAILED, () => createDetailedConfig(level))
    .otherwise(() => createJSONConfig(level)),
});

export const createHTTPLogger = (options: LoggerOptions) => pinoHttp(createHTTPConfig(options));
