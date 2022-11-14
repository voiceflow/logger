import { Writable } from 'node:stream';

import { expect } from 'chai';
import { Logger } from 'pino';

import { LogFormat } from '@/log-format.enum';
import { LogLevel } from '@/log-level.enum';
import { createLogger } from '@/logger';

// Intercept stream and write it to a buffer instaed
function captureStream(stream: Writable) {
  const oldWrite = stream.write;
  let buf = '';
  // eslint-disable-next-line no-param-reassign
  stream.write = function (chunk) {
    buf += chunk.toString(); // chunk is a String or Buffer
    return true;
  };

  return {
    unhook: function unhook() {
      // eslint-disable-next-line no-param-reassign
      stream.write = oldWrite;
    },
    captured: () => buf,
  };
}

describe('Logger integration tests', () => {
  describe('Log level differentiation', () => {
    let loggerInstance: Logger;
    let stdoutInspector: any;

    beforeEach(() => {
      stdoutInspector = captureStream(process.stdout); // Hook needs to be registered before the logger is instantiated
      loggerInstance = createLogger({
        level: LogLevel.TRACE,
        format: LogFormat.JSON,
      });
    });

    afterEach(() => {
      stdoutInspector.unhook();
    });

    it('Logs traces', () => {
      loggerInstance.trace('test trace');

      const parsedLogObj = JSON.parse(stdoutInspector.captured());
      expect(parsedLogObj.level).to.eq(10);
      expect(parsedLogObj.msg).to.eq('test trace');
    });

    it('Logs debug', () => {
      const message = 'test debug';

      loggerInstance.debug(message);

      const parsedLogObj = JSON.parse(stdoutInspector.captured());
      expect(parsedLogObj.level).to.eq(20);
      expect(parsedLogObj.msg).to.eq(message);
    });

    it('Logs info', () => {
      const message = 'test info';

      loggerInstance.info(message);

      const parsedLogObj = JSON.parse(stdoutInspector.captured());
      expect(parsedLogObj.level).to.eq(30);
      expect(parsedLogObj.msg).to.eq(message);
    });

    it('Logs warnings', () => {
      const message = 'test warn';

      loggerInstance.warn(new Error(message));

      const parsedLogObj = JSON.parse(stdoutInspector.captured());
      expect(parsedLogObj.level).to.eq(40);
      expect(parsedLogObj.msg).to.eq(message);
      expect(parsedLogObj).to.have.nested.property('err.message', message);
      expect(parsedLogObj).to.have.nested.property('err.stack');
      expect(parsedLogObj.err.stack).to.be.an('string');
    });

    it('Logs errors', () => {
      const message = 'test error';

      loggerInstance.error(new Error(message));

      const parsedLogObj = JSON.parse(stdoutInspector.captured());
      expect(parsedLogObj.level).to.eq(50);
      expect(parsedLogObj.msg).to.eq(message);
      expect(parsedLogObj).to.have.nested.property('err.message', message);
      expect(parsedLogObj).to.have.nested.property('err.stack');
      expect(parsedLogObj.err.stack).to.be.an('string');
    });

    it('Logs fatal errors', () => {
      const message = 'test fatal';

      loggerInstance.fatal(new Error(message));

      const parsedLogObj = JSON.parse(stdoutInspector.captured());
      expect(parsedLogObj.level).to.eq(60);
      expect(parsedLogObj.msg).to.eq(message);
      expect(parsedLogObj).to.have.nested.property('err.message', message);
      expect(parsedLogObj).to.have.nested.property('err.stack');
      expect(parsedLogObj.err.stack).to.be.a('string');
    });
  });

  describe('Logger config', () => {
    let stdoutInspector: ReturnType<typeof captureStream>; // Needs to be a separate instance since 'describe' suites are run in parallel

    beforeEach(() => {
      stdoutInspector = captureStream(process.stdout); // Hook needs to be registered before the logger is instantiated
    });

    afterEach(() => {
      stdoutInspector.unhook();
    });

    it('Applies default configs if no external config is given', () => {
      const message = 'test message';
      const loggerInstance = createLogger();

      loggerInstance.info(message);

      const parsedLogObj = JSON.parse(stdoutInspector.captured());
      expect(parsedLogObj.level).to.eq(30);
      expect(parsedLogObj.msg).to.eq(message);
    });
  });
});
