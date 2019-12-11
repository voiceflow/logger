'use strict';

const chai = require('chai');
const Caller = require('../../../lib/utils/caller');

const { expect } = chai;

describe('Caller identification', () => {
  // Choose a random function name to test for equality
  const hhbfksmr = (params) => {
    // Add an inner wrapper to emulate the extra stack layer between logger and caller
    const innerWrapper = () => {
      Caller.identify(params);
    };
    innerWrapper();
  };

  it('Identifies the calling function (no additional object merging)', () => {
    const params = [];

    hhbfksmr(params); // Execute function under test

    expect(params[0]).to.have.property('stack');
    expect(params[0].stack.split(' ')[0]).to.eql('hhbfksmr'); // Make sure the function name is correct
  });

  it('Identifies the calling function (with object merging)', () => {
    const params = [
      {
        persistent: 'dummy',
      },
    ];

    hhbfksmr(params); // Execute function under test

    // Ensure that the object being merged retains its properties
    expect(params[0]).to.have.property('persistent');
    expect(params[0].persistent).to.eql('dummy');
    expect(params[0]).to.have.property('stack');
    expect(params[0].stack.split(' ')[0]).to.eql('hhbfksmr'); // Make sure the function name is correct
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

    expect(params[0]).to.have.property('stack');
    expect(params[0].stack).to.be.an('array');
    expect(params[0].stack[0].trim().split(' ')[1]).to.eql('innerWrapper'); // Ensure the top of stack is the innerWrapper
    expect(params[0].stack[1].trim().split(' ')[1]).to.eql('xysbdwcc'); // Ensure the next level up is the random test function name
  });
});
