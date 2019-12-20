export default class FenwickTree {
  constructor(length) {
    this.sums = Array.from({ length }).fill(0);
  }

  /**
   * Time Complexity: O(logN)
   */
  query(value) {
    let sum = 0;
    let i = value;
    while (i > 0) {
      sum += this.sums[i];
      i -= lowbit(i);
    }

    return sum;
  }

  /**
   * Time Complexity: O(logN)
   */
  update(value, delta = 1) {
    let i = value;
    while (i < this.sums.length) {
      this.sums[i] += delta;
      i += lowbit(i);
    }
  }
}

function lowbit(x) {
  return x & -x;
}
