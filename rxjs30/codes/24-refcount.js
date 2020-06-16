const Rx = require('rxjs');
const { multicast, refCount } = require('rxjs/operators');

const source = Rx.interval(1000) //
  .pipe(multicast(new Rx.Subject()))
  .pipe(refCount());

const observerA = {
  next: (value) => console.log('A next:' + value),
  error: (error) => console.log('A error: ' + error),
  complete: () => console.log('A complete!'),
};

const observerB = {
  next: (value) => console.log('B next:' + value),
  error: (error) => console.log('B error: ' + error),
  complete: () => console.log('B complete!'),
};

const subscriptionA = source.subscribe(observerA);

let subscriptionB;
setTimeout(() => {
  subscriptionB = source.subscribe(observerB);
}, 1000);

setTimeout(() => {
  subscriptionA.unsubscribe();
  subscriptionB.unsubscribe();
}, 6000);
