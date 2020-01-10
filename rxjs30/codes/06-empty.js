// 06-empty

const Rx = require('rxjs');

const source = Rx.empty();

source.subscribe({
  next(value) {
    console.log(value);
  },
  complete() {
    console.log('complete');
  }
});
