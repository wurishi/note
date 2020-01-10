// 04-iterator

const arr = [1, 2, 3];
const iterator = arr[Symbol.iterator]();
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());

class IteratorFromArray {
  constructor(arr) {
    this._array = arr;
    this._cursor = 0;
  }

  next() {
    return this._cursor < this._array.length
      ? { value: this._array[this._cursor++], done: false }
      : { value: undefined, done: true };
  }

  map(callback) {
    const iterator = new IteratorFromArray(this._array);
    return {
      next: () => {
        const { done, value } = iterator.next();
        return {
          done,
          value: done ? undefined : callback(value)
        };
      }
    };
  }
}

console.log('---------------------');
const it = new IteratorFromArray([1, 2, 3]);
const newIt = it.map(v => v + 3);
console.log(newIt.next());
console.log(newIt.next());
console.log(newIt.next());
console.log(newIt.next());
