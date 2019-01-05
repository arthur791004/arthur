import MyPromise, { STATE } from '../';

describe('MyPromise', () => {
  const value = 'value';
  const reason = 'reason';
  const exception = new Error(reason);
  const noop = () => {};

  describe('resolve', () => {
    it('should get value from resolve', async () => {
      const result = await new MyPromise((resolve) => {
        resolve(value);
      });

      expect(result).toBe(value);
    });
  });

  describe('reject', () => {
    it('should get reason from reject', async () => {
      try {
        await new MyPromise((resolve, reject) => {
          reject(reason);
        });
      } catch (e) {
        expect(e).toBe(reason);
      }
    });
  });

  describe('then', () => {
    it('should get value from resolve', async () => {
      const thenFn = jest.fn();

      await new MyPromise(resolve => resolve(value))
        .then(thenFn);

      expect(thenFn).toHaveBeenCalledWith(value);
    });

    it('should throw exception', () => {
      try {
        new MyPromise(resolve => resolve(value))
          .then(() => { throw exception; });
      } catch (error) {
        expect(error).toBe(reason);
      }
    });

    it('should be async', () => {
      const thenFn = () => { result = 'then' };
      const syncFn = () => { result = 'sync' };

      new MyPromise(resolve => resolve())
        .then(thenFn);

      syncFn();

      expect(result).toBe('sync');

      setTimeout(() => {
        expect(result).toBe('then');
      });
    });

    it('should always return a new promise', () => {
      const p1 = new Promise(noop);
      const p2 = p1.then(noop);

      expect(p1 instanceof MyPromise);
      expect(p2 instanceof MyPromise);
      expect(p1 === p2).toBe(false);
    });
  });

  describe('catch', () => {
    it('should get reason from reject', async () => {
      const catchFn = jest.fn();

      await new MyPromise((resolve, reject) => reject(reason))
        .catch(catchFn);

      expect(catchFn).toHaveBeenCalledWith(reason);
    });

    it('should not catch error without catch', async () => {
      try {
        await new MyPromise(() => {
          throw exception;
        });
      } catch (error) {
        expect(error).toBe(exception);
      }
    });

    it('should not catch async error', async () => {
      // TODO
    });
  });

  describe('internal state and value', () => {
    it('should change state and value before resolve but not after', async () => {
      const p = new MyPromise((resolve, reject) => {
        setTimeout(() => {
          resolve(1);
          reject(2);
        });
      });

      const orig = Object.assign({}, p);

      await p;

      expect(p.result === orig.result).toBe(false);
      expect(p.state === orig.state).toBe(false);
      expect(p.result).toBe(1);
      expect(p.state).toBe(STATE.FULFILLED);
    });

    it('should change state and value before reject but not after', async () => {
      const p = new MyPromise((resolve, reject) => {
        setTimeout(() => {
          reject(1);
          resolve(2);
        });
      });

      const orig = Object.assign({}, p);

      try {
        await p;
      } catch (error) {
        expect(p.result === orig.result).toBe(false);
        expect(p.state === orig.state).toBe(false);
        expect(p.result).toBe(1);
        expect(p.state).toBe(STATE.REJECTED);
      }
    });
  });
});