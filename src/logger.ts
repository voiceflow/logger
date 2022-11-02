import { createDetailedLogger } from './detailed.logger';
import { createInlineLogger } from './inline.logger';
import { createJSONLogger } from './json.logger';
import { LogFormat } from './log-format.enum';
import { LogLevel } from './log-level.enum';
import { LoggerOptions } from './logger-options.interface';

export const DEFAULT_OPTIONS: LoggerOptions = {
  format: LogFormat.JSON,
  level: LogLevel.WARN,
};

export const createLogger = (options: Partial<LoggerOptions> = {}) => {
  const { format, level } = { ...DEFAULT_OPTIONS, ...options };

  switch (format) {
    case LogFormat.DETAILED:
      return createDetailedLogger(level);
    case LogFormat.INLINE:
      return createInlineLogger(level);
    case LogFormat.JSON:
    default:
      return createJSONLogger(level);
  }
};
