'use strict';

const pino = require('pino');
const expressPino = require('express-pino-logger');

const Prettifier = require('@voiceflow/pino-pretty');
const { Caller } = require('../utils');

const defaultConfigs = {
  level: 'info',
  stackTrace: false,
  pretty: false,
};

class Logger {
  constructor(config) {
    this.config = config != null ? config : defaultConfigs;
    this.baseLoggerConfig = {
      level: this.config.level || defaultConfigs.level,
      base: null,
    };

    if (this.config.pretty) {
      this.baseLoggerConfig.prettifier = Prettifier;
      this.baseLoggerConfig.prettyPrint = {
        levelFirst: true,
        translateTime: true,
      };
    }

    this.baseLogger = pino(this.baseLoggerConfig);
    this.middlewareLogger = expressPino({
      logger: this.baseLogger, // Use the instantiated base logger
    });
  }

  trace(...params) {
    this.baseLogger.trace(...params);
  }

  debug(...params) {
    this.baseLogger.debug(...params);
  }

  info(...params) {
    this.baseLogger.info(...params);
  }

  warn(...params) {
    const logPayload = Caller.identify(params); // Full stack trace not needed for warnings
    this.baseLogger.warn(...logPayload);
  }

  error(...params) {
    const logPayload = Caller.identify(params, this.config.stackTrace);
    this.baseLogger.error(...logPayload);
  }

  fatal(...params) {
    const logPayload = Caller.identify(params, this.config.stackTrace);
    this.baseLogger.fatal(...logPayload);
  }
}

module.exports = Logger;
