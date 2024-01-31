import pino from 'pino';

import { LogLevel } from './log-level.enum';
import { MinimalSerializer } from './serializers/minimal';

export const createJSONConfig = (level: LogLevel): pino.LoggerOptions => ({
  level,
  serializers: MinimalSerializer,
});

export const createJSONLogger = (level: LogLevel) => pino(createJSONConfig(level));
