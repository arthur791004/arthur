import Heap from '../Heap';

describe('Heap', () => {
  describe('push and peek', () => {
    it('should return maximum element', () => {
      const maxHeap = new Heap();

      expect(maxHeap.peek()).toBe(undefined);
      maxHeap.push(1);
      expect(maxHeap.peek()).toBe(1);
      maxHeap.push(2);
      expect(maxHeap.peek()).toBe(2);
      maxHeap.push(3);
      expect(maxHeap.peek()).toBe(3);
    });

    it('should return minimum element', () => {
      const maxHeap = new Heap((a, b) => a < b);

      expect(maxHeap.peek()).toBe(undefined);
      maxHeap.push(3);
      expect(maxHeap.peek()).toBe(3);
      maxHeap.push(2);
      expect(maxHeap.peek()).toBe(2);
      maxHeap.push(1);
      expect(maxHeap.peek()).toBe(1);
    });
  });

  describe('size', () => {
    it('should return correct size', () => {
      const maxHeap = new Heap();

      expect(maxHeap.size).toBe(0);
      maxHeap.push(1);
      expect(maxHeap.size).toBe(1);
      maxHeap.push(2);
      expect(maxHeap.size).toBe(2);
      maxHeap.push(3);
      expect(maxHeap.size).toBe(3);
    });
  });

  describe('pop', () => {
    it('should return root element and size would decrease by 1', () => {
      const maxHeap = new Heap();

      maxHeap.push(1);
      maxHeap.push(2);
      maxHeap.push(3);

      expect(maxHeap.size).toBe(3);
      expect(maxHeap.pop()).toBe(3);
      expect(maxHeap.size).toBe(2);
      expect(maxHeap.pop()).toBe(2);
      expect(maxHeap.size).toBe(1);
      expect(maxHeap.pop()).toBe(1);
      expect(maxHeap.size).toBe(0);
    });

    it('should return undefined if there is no element in the heap', () => {
      const maxHeap = new Heap();

      expect(maxHeap.pop()).toBe(undefined);
    });
  });
});
