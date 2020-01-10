// 06-interval

const Rx = require('rxjs');

// const source = Rx.Observable.create(observer => {
//   let i = 0;
//   setInterval(() => {
//     observer.next(i++);
//   }, 1000);
// });

// 可以使用 Rx.interval 创建和上面代码基本上相同的 observable.
const source = Rx.interval(1000);
// Rx.interval 的第一个参数必须是数值 (number), 这个数值代表了间隔时间 (ms).

source.subscribe(value => console.log(value));
