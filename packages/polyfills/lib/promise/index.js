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

  then(onFulfillment, onRejection) {
    // always return new Promise
    return new this.constructor((resolve, reject) => {
      this.onFulfillment = onFulfillment;
      this.onRejection = onRejection;

      if (this.state === STATE.PENDING) {
        return;
      }

      try {
        resolve.call(this, done(this));
      } catch (reason) {
        reject.call(this, reason);
      }
    });
  }

  catch(onRejection) {
    return this.then(undefined, onRejection);
  }
};

function resolve(value) {
  try {
    const result = isThenable(value)
      ? value.then()
      : value;

    fulfill.call(this, result);
  } catch (reason) {
    reject.call(this, reason);
  }
}

function fulfill(value) {
  if (this.state !== STATE.PENDING) {
    return;
  }

  this.state = STATE.FULFILLED;
  this.result = value;

  done(this);
}

function reject(reason) {
  if (this.state !== STATE.PENDING) {
    return;
  }

  this.state = STATE.REJECTED;
  this.result = reason;

  done(this);
}

function done(promise) {
  const { result } = promise;
  const callback = getCallback(promise);

  // callback should be function
  if (typeof callback !== 'function') {
    return;
  }

  // callback should be executed asynchronously
  makeAsyncFn(callback)(result);
}

function getCallback(promise) {
  const { state, onFulfillment, onRejection } = promise;

  switch (state) {
    case STATE.FULFILLED:
      return onFulfillment;
    case STATE.REJECTED:
      return onRejection;
    default:
      return;
  }
}

function isThenable(value) {
  return value && typeof value.then === 'function';
}

function makeAsyncFn(fn) {
  // simulate async via setTimeout
  return (...args) => {
    setTimeout(() => fn.apply(this, args));
  };
}
