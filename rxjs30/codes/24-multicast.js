const Rx = require('rxjs');

const { take, multicast } = require('rxjs/operators');

const source = Rx.interval(1000) //
  .pipe(take(3))
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

source.subscribe(observerA); // 等价于 subject.subscribe(observerA)

source.connect(); // 等价于 source.subscribe(subject)

setTimeout(() => {
  source.subscribe(observerB);
}, 1000);
