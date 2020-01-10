const Rx = require('rxjs');

const arr = ['Jerry', 'Anna', 2016, 2017, '30 days', 2020];
// const source = Rx.Observable.from(arr);// 新版本已经不支持, 直接使用 Rx.from
const source = Rx.from(arr);

source.subscribe({
  next(value) {
    console.log(value);
  },
  complete() {
    console.log('complete');
  },
  error(err) {
    console.log(err);
  }
});
