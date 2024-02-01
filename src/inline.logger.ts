import pino from 'pino';

import { LogLevel } from './log-level.enum';
import { MinimalSerializer } from './serializers/minimal';

export const createInlineConfig = (level: LogLevel): pino.LoggerOptions => ({
  level,
  transport: {
    target: 'pino-pretty',
    options: { include: 'time,level' },
  },
  serializers: MinimalSerializer,
});

export const createInlineLogger = (level: LogLevel) => pino(createInlineConfig(level));
