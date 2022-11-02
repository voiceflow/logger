import pino from 'pino';

import { LogLevel } from './log-level.enum';

export const createDetailedConfig = (level: LogLevel): pino.LoggerOptions => ({
  level,
  transport: { target: 'pino-pretty' },
});

export const createDetailedLogger = (level: LogLevel) => pino(createDetailedConfig(level));
