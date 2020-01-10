const Rx = require('rxjs');

// console source = Rx.Observable.of('Jerry', 'Anna'); // 新版已经不支持, 直接使用Rx.of
const source = Rx.of('Jerry', 'Anna');

source.subscribe(
  value => console.log(value),
  error => console.log(error),
  () => console.log('complete')
);
