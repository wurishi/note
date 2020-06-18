const Rx = require('rxjs');
const { startWith, observeOn } = require('rxjs/operators');

const asyncSource = Rx.from([1, 2, 3]).pipe(
  startWith('async', Rx.asyncScheduler)
);
const asapSource = Rx.from([4, 5, 6]).pipe(startWith('asap', Rx.asapScheduler));
const queueSouce = Rx.from([7, 8, 9]).pipe(
  startWith('queue', Rx.queueScheduler)
);

console.log('before');
Rx.merge(asyncSource, asapSource, queueSouce).subscribe(console.log);
console.log('after');

const source = Rx.Observable.create(async (observer) => {
  observer.next('a');
  await new Promise((r) => setTimeout(r, 1000));
  observer.next('b');
  observer.complete();
  observer.next('c');
});

source.subscribe(
  (v) => console.log('source:' + v),
  null,
  () => console.log('source complete')
);
source
  .pipe(observeOn(Rx.queueScheduler)) //
  .subscribe(
    (v) => console.log('queue', v),
    null,
    () => console.log('queue', 'complete')
  );
