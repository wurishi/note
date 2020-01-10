const Rx = require('rxjs');

const promise = new Promise(resolve => {
  setTimeout(() => {
    resolve('Hello RxJS');
  }, 1000);
});

const source = Rx.from(promise);
// const source = Rx.fromPromise(promise); // 新版本已经没有 fromPromise 了?
source.subscribe(value => console.log(value));
