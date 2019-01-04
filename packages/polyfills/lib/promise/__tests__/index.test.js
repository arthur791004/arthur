import MyPromise from '../';

describe('MyPromise', () => {
  const value = 'value';
  const reason = 'reason';

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
  });

  describe('catch', () => {
    it('should get reason from reject', async () => {
      const catchFn = jest.fn();

      await new MyPromise((resolve, reject) => reject(reason))
        .catch(catchFn);

      expect(catchFn).toHaveBeenCalledWith(reason);
    });

    it('should not catch error without catch', () => {

    });

    it('should not catch async error', () => {

    });
  });

  describe('status', () => {
    it('should change status before resolve', () => {

    });

    it('should change status before reject', () => {

    });

    it('should not change status after resolve', () => {

    });

    it('should not change status after reject', () => {

    });
  });

  describe('value', () => {
    it('should store the result', () => {

    });
  });

  describe('others', () => {
    it('should be async', () => {

    });

    it('should always return a new promise', () => {

    });
  })
});