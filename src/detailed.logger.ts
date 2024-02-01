import pino from 'pino';

import { LogLevel } from './log-level.enum';
import { MaximalSerializer } from './serializers/maximal';

export const createDetailedConfig = (level: LogLevel): pino.LoggerOptions => ({
  level,
  transport: { target: 'pino-pretty' },
  serializers: MaximalSerializer,
});

export const createDetailedLogger = (level: LogLevel) => pino(createDetailedConfig(level));
