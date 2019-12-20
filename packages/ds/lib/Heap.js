export default class Heap {
  constructor(comparator) {
    this.data = [];

    /**
     * comparator
     * @default isLarger - use max heap as default
     * @param {*} a
     * @param {*} b
     * @returns {boolean} - true if a should be parent
     */
    this.comparator = comparator || isLarger;
  }

  get size() {
    return this.data.length;
  }

  peek() {
    return this.data[0];
  }

  pop() {
    if (this.size === 0) {
      return undefined;
    }

    swap(this.data, 0, this.size - 1);
    const root = this.data.pop();
    this.topDown(0);

    return root;
  }

  push(value) {
    this.data.push(value);
    this.bottomUp(this.size - 1);
  }

  bottomUp(idx) {
    let current = idx;

    while (current > 0) {
      const parent = getParent(current);
      if (!this.comparator(this.data[current], this.data[parent])) {
        break;
      }

      swap(this.data, parent, current);
      current = parent;
    }
  }

  topDown(idx) {
    let current = idx;

    while (getLeft(current) < this.size) {
      const left = getLeft(current);
      const right = left + 1;
      const target =
        right < this.size && this.comparator(this.data[right], this.data[left])
          ? right
          : left;

      if (!this.comparator(this.data[target], this.data[current])) {
        break;
      }

      swap(this.data, target, current);
      current = target;
    }
  }
}

function getParent(idx) {
  return Math.floor((idx - 1) / 2);
}

function getLeft(idx) {
  return 2 * idx + 1;
}

function swap(data, a, b) {
  const tmp = data[a];
  data[a] = data[b];
  data[b] = tmp;
}

function isLarger(a, b) {
  return a >= b;
}
