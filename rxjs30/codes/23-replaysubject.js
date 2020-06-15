const Rx = require('rxjs');

const subject = new Rx.ReplaySubject(2); // 重新发送最后 2 个元素

const observerA = {
  next: (value) => console.log('A next: ' + value),
  error: (error) => console.log('A error: ' + error),
  complete: () => console.log('A complete!'),
};

const observerB = {
  next: (value) => console.log('B next: ' + value),
  error: (error) => console.log('B error: ' + error),
  complete: () => console.log('B complete!'),
};

subject.subscribe(observerA);
subject.next(1);
subject.next(2);
subject.next(3);

setTimeout(() => {
  subject.subscribe(observerB);
  // B next: 2
  // B next: 3
}, 3000);
