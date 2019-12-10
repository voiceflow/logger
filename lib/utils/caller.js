'use strict';

const STACKTRACE_OFFSET = 2;
const LINE_OFFSET = 7;

class Caller {
  static identify (params, stackTrace=false) {
    const callStack = Error().stack.split('\n').slice(STACKTRACE_OFFSET);
    const callFunction = callStack.filter(s => !s.includes('node_modules/pino') && !s.includes('node_modules\\pino'))[1].substr(LINE_OFFSET);
    const callerObj = {
      caller: stackTrace ? callStack : callFunction,
    };

    typeof(params[0]) === 'object' ? params[0].caller = callerObj.caller : params.unshift(callerObj);

    return params
  };
}

module.exports = Caller;