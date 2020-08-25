const STACKTRACE_OFFSET = 3;
const LINE_OFFSET = 7;

export default class Caller {
  static identify(params: any[], stackTrace = false) {
    const callStack = Error()
      .stack?.split('\n')
      .slice(STACKTRACE_OFFSET);
    const callFunction = callStack?.filter((s) => !s.includes('node_modules/pino') && !s.includes('node_modules\\pino'))[1].substr(LINE_OFFSET);
    const callerObj = {
      stack: stackTrace ? callStack : callFunction,
    };

    if (typeof params[0] === 'object') {
      params[1] = callerObj.stack;
    } else {
      params.unshift(callerObj);
    }

    return params;
  }
}
