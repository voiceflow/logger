[![circle ci](https://circleci.com/gh/voiceflow/logger.svg?style=shield&circle-token=8c4e4ce8d04d87f16e903bd7e1ccab194a118262)](https://circleci.com/gh/voiceflow/logger)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=voiceflow_logger&metric=coverage)](https://sonarcloud.io/dashboard?id=voiceflow_logger)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=voiceflow_logger&metric=alert_status)](https://sonarcloud.io/dashboard?id=voiceflow_logger)
# logger

Author: Frank Gu <<frank@voicelfow.com>>
Date: Dec 11, 2019

A logging package for VERY fast and useful JSON logging.

- All log entries go to `process.stdout`
- Minimal overhead and no logger hierarchies
- Multiple instantiations allowed

## Usage

```javascript
const Logger = require('@voiceflow/logger');

defaultOptions = {
  level: 'info',
  pretty: false,
};

overrideOptions = {
  level: 'trace', // Minimum log-level to be printed
  pretty: true, // Pretty print
};

const defaultlogger = new Logger(); // Default options
const customLogger = new Logger(overrideOptions);

defaultlogger.trace('this is a trace');
defaultlogger.debug('this is a debug');
defaultlogger.info('this is an info');
defaultlogger.warn('this is a warning');
defaultlogger.error('this is an error');
defaultlogger.fatal('this is a fatal');

customLogger.trace('this is a trace');
customLogger.debug('this is a debug');
customLogger.info('this is an info');
customLogger.warn('this is a warning');
customLogger.error('this is an error');
customLogger.fatal('this is a fatal');
```

### Development Assitance

- For `warn` logs, the calling function and line number is included
- For `error` and `fatal` logs, the full call-stack is included

### Pretty Printing

Pretty printing will add colors, parse unix epoch timestamps into UTC time.
