// 05-createasync
const Rx = require('rxjs');

const observable = Rx.Observable.create(observer => {
  observer.next('Jerry');
  observer.next('Anna');
  setTimeout(() => observer.next('RxJS 30'), 30);
});
console.log('start');
observable.subscribe(value => console.log(value));
console.log('end');

// start->jerry->Anna->end->RxJS 30
