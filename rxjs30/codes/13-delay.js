// 13-delay

const Rx = require('rxjs');
const { delay, take } = require('rxjs/operators');

const source = Rx.interval(300).pipe(take(5));
const example = source.pipe(delay(500));
example.subscribe({
  next: console.log,
  complete: console.log.bind(console, 'complete')
});
