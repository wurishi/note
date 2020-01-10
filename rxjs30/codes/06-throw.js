// 06-throw

const Rx = require('rxjs');

// const source = Rx.throw('Oop!'); // 新版本没有 throw , 直接使用 throwError
const source = Rx.throwError('Oop!');

source.subscribe({
  next(value) {
    console.log(value);
  },
  complete() {
    console.log('complete');
  },
  error(err) {
    console.log('Throw Error: ' + err);
  }
});
