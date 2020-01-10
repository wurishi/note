// 06-unsubscribe

const Rx = require('rxjs');

const source = Rx.interval(1000);

const subscription = source.subscribe({
  next(value) {
    console.log(value);
  },
  complete() {
    console.log('complete');
  }
});

setTimeout(() => {
  subscription.unsubscribe(); // RxJS 4.x 以前的版本使用 dispose()
}, 5100); // 5100而不是5000, 5000有可能没法输出0-4,
