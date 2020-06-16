const Rx = require('rxjs');
const { take } = require('rxjs/operators');

const source = Rx.interval(1000).pipe(take(3));

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

const subject = new Rx.Subject();
subject.subscribe(observerA);

source.subscribe(subject);

setTimeout(() => {
  subject.subscribe(observerB);
}, 1000);
