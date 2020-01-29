// 22-multiple-subscriptions

const Rx = require('rxjs');
const { take } = require('rxjs/operators');

const source = Rx.interval(1000).pipe(take(3));

const observerA = {
  next: value => console.log('A next: ' + value),
  error: error => console.log('A error: ' + error),
  complete: () => console.log('A Complete!')
};

const observerB = {
  next: value => console.log('B next: ' + value),
  error: error => console.log('B error: ' + error),
  complete: () => console.log('B Complete!')
};

source.subscribe(observerA);
// source.subscribe(observerB);

// 延迟订阅
setTimeout(() => {
  source.subscribe(observerB);
}, 1000);
