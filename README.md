[![circle ci](https://circleci.com/gh/voiceflow/logger.svg?style=shield&circle-token=8c4e4ce8d04d87f16e903bd7e1ccab194a118262)](https://circleci.com/gh/voiceflow/logger)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=voiceflow_logger&metric=coverage)](https://sonarcloud.io/dashboard?id=voiceflow_logger)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=voiceflow_logger&metric=alert_status)](https://sonarcloud.io/dashboard?id=voiceflow_logger)

# logger

A standardized package for logging built on `pino`.

## Usage

```ts
import { createLogger, LogLevel, LogFormat } from '@voiceflow/logger';

const logger = createLogger({ format: LogFormat.JSON, level: LogLevel.INFO });

const inlineLogger = createLogger({ format: LogFormat.INLINE, level: LogLevel.WARN });

const detailedLogger = createLogger({ format: LogFormat.DETAILED, level: LogLevel.TRACE });

logger.trace('this is a trace log');
logger.debug('this is a debug log');
logger.info('this is an info log');
logger.warn('this is a warning log');
logger.error('this is an error log');
logger.fatal('this is a fatal log');
```
