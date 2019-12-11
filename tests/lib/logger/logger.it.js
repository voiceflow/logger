'use strict';

const chai = require('chai');

const Logger = require('../../..');

const { expect } = chai;

// Intercept stream and write it to a buffer instaed
function captureStream(stream) {
  const oldWrite = stream.write;
  let buf = '';
  stream.write = function(chunk) {
    buf += chunk.toString(); // chunk is a String or Buffer
  };

  return {
    unhook: function unhook() {
      stream.write = oldWrite;
    },
    captured: () => buf,
  };
}

describe('Logger integration tests', () => {
  describe('Log level differentiation', () => {
    let loggerInstance;
    let stdoutInspector;
    beforeEach(() => {
      stdoutInspector = captureStream(process.stdout); // Hook needs to be registered before the logger is instantiated
      loggerInstance = new Logger({
        stackTrace: false,
        level: 'trace',
      });
    });

    afterEach(() => {
      stdoutInspector.unhook();
    });

    it('Logs traces', () => {
      loggerInstance.trace('test trace');
      const parsedLogObj = JSON.parse(stdoutInspector.captured());

      expect(parsedLogObj.level).to.equal(10);
      expect(parsedLogObj.msg).to.eql('test trace');
      expect(parsedLogObj.v).to.eql(1);
    });

    it('Logs debug', () => {
      loggerInstance.debug('test debug');
      const parsedLogObj = JSON.parse(stdoutInspector.captured());

      expect(parsedLogObj.level).to.equal(20);
      expect(parsedLogObj.msg).to.eql('test debug');
      expect(parsedLogObj.v).to.eql(1);
    });

    it('Logs info', () => {
      loggerInstance.info('test info');
      const parsedLogObj = JSON.parse(stdoutInspector.captured());

      expect(parsedLogObj.level).to.equal(30);
      expect(parsedLogObj.msg).to.eql('test info');
      expect(parsedLogObj.v).to.eql(1);
    });

    it('Logs warnings', () => {
      loggerInstance.warn('test warn');
      const parsedLogObj = JSON.parse(stdoutInspector.captured());

      expect(parsedLogObj.level).to.equal(40);
      expect(parsedLogObj.msg).to.eql('test warn');
      expect(parsedLogObj.v).to.eql(1);
      expect(parsedLogObj).to.have.property('stack');
      expect(parsedLogObj.stack).to.be.an('string');
    });

    it('Logs errors', () => {
      loggerInstance.error('test error');
      const parsedLogObj = JSON.parse(stdoutInspector.captured());

      expect(parsedLogObj.level).to.equal(50);
      expect(parsedLogObj.msg).to.eql('test error');
      expect(parsedLogObj.v).to.eql(1);
      expect(parsedLogObj).to.have.property('stack');
      expect(parsedLogObj.stack).to.be.an('string');
    });

    it('Logs fatal errors', () => {
      loggerInstance.fatal('test fatal');
      const parsedLogObj = JSON.parse(stdoutInspector.captured());

      expect(parsedLogObj.level).to.equal(60);
      expect(parsedLogObj.msg).to.eql('test fatal');
      expect(parsedLogObj.v).to.eql(1);
      expect(parsedLogObj).to.have.property('stack');
      expect(parsedLogObj.stack).to.be.an('string');
    });
  });

  describe('Logger config', () => {
    let stdoutInspector; // Needs to be a separate instance since 'describe' suites are run in parallel
    beforeEach(() => {
      stdoutInspector = captureStream(process.stdout); // Hook needs to be registered before the logger is instantiated
    });

    afterEach(() => {
      stdoutInspector.unhook();
    });

    it('Applies default configs if no external config is given', () => {
      const loggerInstance = new Logger();
      loggerInstance.info('test info');
      const parsedLogObj = JSON.parse(stdoutInspector.captured());

      expect(parsedLogObj.level).to.equal(30);
      expect(parsedLogObj.msg).to.eql('test info');
      expect(parsedLogObj.v).to.eql(1);
    });
  });
});
