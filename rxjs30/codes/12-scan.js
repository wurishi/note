// 12-scan

const Rx = require('rxjs');
const { scan, reduce, zip } = require('rxjs/operators');

const source = Rx.from('hello').pipe(zip(Rx.interval(600), (x, y) => x));
const example = source.pipe(scan((origin, next) => origin + next, ''));
example.subscribe({
  next: console.log,
  complete: console.log.bind(console, 'complete')
});
