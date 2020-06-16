const Rx = require('rxjs');
const { map } = require('rxjs/operators');

const source = Rx.interval(1000);
const subject = new Rx.Subject();

const example = subject.pipe(
  map((x) => {
    if (x === 1) {
      throw new Error('oops');
    }
    return x;
  })
);

subject.subscribe((x) => console.log('A', x));
example.subscribe(
  (x) => console.log('B', x),
  (error) => console.log('B Error:' + error)
);
subject.subscribe((x) => console.log('C', x));

source.subscribe(subject);
