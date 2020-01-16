// 14-throttletime

const Rx = require('rxjs');
const { throttleTime, take } = require('rxjs/operators');

const source = Rx.interval(300).pipe(take(5));
const example = source.pipe(throttleTime(1000));
example.subscribe({
  next: console.log,
  complete: console.log.bind(console, 'complete')
});
