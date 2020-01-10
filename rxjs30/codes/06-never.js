// 06-never

const Rx = require('rxjs');

const source = Rx.never();

source.subscribe({
  next(value) {
    console.log(value);
  },
  error(err) {
    console.log(err);
  },
  complete() {
    console.log('complete');
  }
});
