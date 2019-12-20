import Subset from '../Subset';

describe('Subset', () => {
  describe('findSetAndCollapsing', () => {
    it('should find the root of element', () => {
      const subset = new Subset(2);

      expect(subset.findSetAndCollapsing(0)).toBe(0);
      expect(subset.findSetAndCollapsing(1)).toBe(1);
    });
  });

  describe('union', () => {
    it('should merge x and y into a subset', () => {
      const subset = new Subset(2);

      let rootX = subset.findSetAndCollapsing(0);
      let rootY = subset.findSetAndCollapsing(1);

      expect(rootX).not.toBe(rootY);

      subset.union(0, 1);
      rootX = subset.findSetAndCollapsing(0);
      rootY = subset.findSetAndCollapsing(1);

      expect(rootX).toBe(rootY);
    });
  });
});
