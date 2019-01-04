/**
 * Implement promise polyfills according to Promises/A+
 * See: https://www.ecma-international.org/ecma-262/6.0/#sec-promise-constructor
 */
const STATE = Object.freeze({
  PENDING: 0,
  FULFILLED: 1,
  REJECTED: 2,
});

export default class Promise {
  state = STATE.PENDING;
  result = undefined;

  constructor(resolver) {
    const resolveFn = resolve.bind(this);
    const rejectFn = reject.bind(this);

    // should catch the exception
    try {
      resolver(resolveFn, rejectFn);
    } catch (reason) {
      rejectFn(reason);
    }
  }
};

function resolve(value) {
  this.state = STATE.FULFILLED;
  this.result = value;
}

function reject(reason) {
  this.state = STATE.REJECTED;
  this.result = reason;
}
