/**
 * Subset: [7, -4, 1, 1, -1, 3, 0, -3]
 * If element is nagtive value, it means it is a root of subset and the abs means total element in this subset
 * If element is positive value, it means its parent is at that index value
 * 
 * For example:
 * 1. array[0] is 7 and it means its parent is array[7]
 * 2. array[1] is -4 and it means its a root of subset and it has 4 elements.
 */
export default class Subset {
  constructor(size) {
    this.subset = Array.from({ length: size }).fill(-1);
  }

  /**
   * find element is belong to which subset and collapse the height of subset
   */
  findSetAndCollapsing(element) {
    // find root
    let root = element;
    while (this.subset[root] >= 0) {
      root = this.subset[root];
    }

    // collapsing
    let current = element;
    while (current !== root) {
      let parent = this.subset[current];
      this.subset[current] = root;
      current = parent;
    }

    return root;
  }

  /**
   * merge x and y into a subset
   */
  union(x, y) {
    const rootX = this.findSetAndCollapsing(x);
    const rootY = this.findSetAndCollapsing(y);

    if (this.subset[rootX] <= this.subset[rootY]) {
      this.subset[rootX] += this.subset[rootY];
      this.subset[rootY] = rootX;
    } else {
      this.subset[rootY] += this.subset[rootX];
      this.subset[rootX] = rootY;
    }
  }
}