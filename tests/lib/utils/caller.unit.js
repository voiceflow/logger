'use strict';

const chai = require('chai');
const Caller = require('../../../lib/utils/caller');

const { expect } = chai;

describe('Caller identification', () => {
  it('Identifies the calling function (no additional object merging)', () => {
    const params = [];
    const stackTrace = false;
    // Choose a random function name to test for equality
    const hhbfksmr = () => {
      // Add an inner wrapper to emulate the extra stack layer between logger and caller
      const innerWrapper = () => {
        Caller.identify(params, stackTrace);
      };
      innerWrapper();
    };

    hhbfksmr(); // Execute function under test

    expect(params[0]).to.have.property('caller');
    expect(params[0].caller.split(' ')[0]).to.eql('hhbfksmr'); // Make sure the function name is correct
  });

  it('Identifies the calling function (with object merging)', () => {
    const params = [
      {
        persistent: 'dummy',
      },
    ];
    const stackTrace = false;
    // Choose a random function name to test for equality
    const jtufblyh = () => {
      // Add an inner wrapper to emulate the extra stack layer between logger and caller
      const innerWrapper = () => {
        Caller.identify(params, stackTrace);
      };
      innerWrapper();
    };

    jtufblyh(); // Execute function under test

    // Ensure that the object being merged retains its properties
    expect(params[0]).to.have.property('persistent');
    expect(params[0].persistent).to.eql('dummy');
    expect(params[0]).to.have.property('caller');
    expect(params[0].caller.split(' ')[0]).to.eql('jtufblyh'); // Make sure the function name is correct
  });

  it('Prints a stack trace if stackTrace flag is enabled', () => {
    const params = [];
    const stackTrace = true;
    const xysbdwcc = () => {
      // Add an inner wrapper to emulate the extra stack layer between logger and caller
      const innerWrapper = () => {
        Caller.identify(params, stackTrace);
      };
      innerWrapper();
    };

    xysbdwcc(); // Execute function under test

    expect(params[0]).to.have.property('caller');
    expect(params[0].caller).to.be.an('array');
    expect(params[0].caller[0].trim().split(' ')[1]).to.eql('innerWrapper'); // Ensure the top of stack is the innerWrapper
    expect(params[0].caller[1].trim().split(' ')[1]).to.eql('xysbdwcc'); // Ensure the next level up is the random test function name
  });
});
