import pino from 'pino';

import { LogLevel } from './log-level.enum';

export const createInlineConfig = (level: LogLevel): pino.LoggerOptions => ({
  level,
  transport: {
    target: 'pino-pretty',
    options: { include: 'time,level' },
  },
});

export const createInlineLogger = (level: LogLevel) => pino(createInlineConfig(level));
