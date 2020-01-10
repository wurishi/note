// 05-create

const Rx = require('rxjs');

const observable = Rx.Observable.create(function(observer) {
  // console.log(3); // 只在有观察者时, 这里的代码才会执行
  observer.next('Jerry'); // RxJS 4.x 以前使用的是 onNext
  observer.next('Anna');
});
// console.log(1);

observable.subscribe(value => {
  console.log(value);
});
// console.log(2);
// 虽然RxJS主要是用来处理异步操作的, 但同时也是可以处理同步操作的.
// 以上代码就是同步执行的: 1->3->2
