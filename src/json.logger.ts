import pino from 'pino';

import { LogLevel } from './log-level.enum';

export const createJSONConfig = (level: LogLevel): pino.LoggerOptions => ({ level });

export const createJSONLogger = (level: LogLevel) => pino(createJSONConfig(level));
