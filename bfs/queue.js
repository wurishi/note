export default class {
  constructor() {
    this.items = new WeakMap();
    this.items.set(this, []);
  }

  offer(...element) {
    let q = this.items.get(this);
    q.push(...element);
  }

  poll() {
    let q = this.items.get(this);
    return q.shift();
  }

  isEmpty() {
    return this.size() === 0;
  }

  size() {
    let q = this.items.get(this);
    return q.length;
  }

  clear() {
    this.items.set(this, []);
  }
}
