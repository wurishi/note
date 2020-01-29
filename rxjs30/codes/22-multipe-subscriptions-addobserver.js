// 22-multipe-subscriptions-addobserver

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

const subject = {
  observers: [],
  addObserver(observer) {
    this.observers.push(observer);
  },
  next(value) {
    this.observers.forEach(o => o.next(value));
  },
  error(error) {
    this.observers.forEach(o => o.error(error));
  },
  complete() {
    this.observers.forEach(o => o.complete());
  }
};

subject.addObserver(observerA);

source.subscribe(subject);

setTimeout(() => {
  subject.addObserver(observerB);
}, 1000);
