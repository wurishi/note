!(function () {
  const iterable = {
    [Symbol.iterator]() {
      let step = 0;
      let iterator = {
        next() {
          if (step <= 2) step++;
          switch (step) {
            case 1:
              return { value: 'hello', done: false };
            case 2:
              return { value: 'world', done: false };
            default:
              return { value: undefined, done: true };
          }
        },
      };
      return iterator;
    },
  };

  for (let x of iterable) {
    console.log(x);
  }
})();

!(function () {
  function iterateOver(...args) {
    let index = 0;
    let iterable = {
      [Symbol.iterator]() {
        return this;
      },
      next() {
        if (index < args.length) {
          return { value: args[index++] };
        } else {
          return { done: true };
        }
      },
      // return() {
      //   index = 0;
      //   return { done: true };
      // }
    };
    return iterable;
  }

  const it = iterateOver('a', 'b', 'c', 'd');
  for (let x of it) {
    console.log(1, x);
    break;
  }
  for (let x of it) {
    console.log(2, x);
  }

  const arr = [];
  const iterator = arr[Symbol.iterator]();
  console.log(iterator[Symbol.iterator]() === iterator);

  arr.push(1);
  arr.push(2);

  console.log('for of arr');
  for (let x of arr) {
    console.log(x);
    break;
  }
  for (let x of arr) {
    console.log(x);
  }

  console.log('for of arr iterator');
  const arrI = arr[Symbol.iterator]();
  for (let x of arrI) {
    console.log(x);
    break;
  }
  for (let x of arrI) {
    console.log(x);
  }

  console.log('for of arr values');
  const values = arr.values();
  for (let x of values) {
    console.log(x);
    break;
  }
  for (let x of values) {
    console.log(x);
  }
})();
