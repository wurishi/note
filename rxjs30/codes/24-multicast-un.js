const Rx = require('rxjs');
const { take, multicast } = require('rxjs/operators');

// let source = Rx.interval(1000); //
// source.subscribe((x) => console.log('send: ' + x));
// source = source.pipe(multicast(new Rx.Subject()));

// .do((x) => console.log('send: ' + x))

// .pipe(multicast(new Rx.Subject()));

const source = Rx.interval(1000) //
  .pipe(multicast(new Rx.Subject()));

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

const realSubscription = source.connect();

let subscriptionB;
setTimeout(() => {
  subscriptionB = source.subscribe(observerB);
}, 1000);

setTimeout(() => {
  subscriptionA.unsubscribe();
  subscriptionB.unsubscribe();
}, 5000);

setTimeout(() => {
  realSubscription.unsubscribe();
}, 7000);
