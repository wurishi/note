const Rx = require('rxjs');
const { observeOn } = require('rxjs/operators');
Rx.asapScheduler;
Rx.queueScheduler;
Rx.asyncScheduler;
Rx.animationFrameScheduler;
Rx.VirtualTimeScheduler;

const observable = Rx.Observable.create((observer) => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();
}).pipe(observeOn(Rx.asyncScheduler));

Rx.from([1, 2, 3], Rx.asyncScheduler).subscribe((v) => console.log('a' + v));

console.log('before subscribe');

observable.subscribe(
  (value) => console.log(value),
  (error) => console.log('Error: ' + error),
  () => console.log('complete')
);

console.log('after subscribe');
