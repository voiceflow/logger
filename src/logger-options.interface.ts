import { LogFormat } from './log-format.enum';
import { LogLevel } from './log-level.enum';

export interface LoggerOptions {
  level: LogLevel;
  format: LogFormat;
}
