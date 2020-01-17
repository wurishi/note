// 15-distinct-selector

const Rx = require('rxjs');
const { zip, distinct } = require('rxjs/operators');

const source = Rx.from([
  { value: 'a' },
  { value: 'b' },
  { value: 'c' },
  { value: 'a' },
  { value: 'b' }
]).pipe(zip(Rx.interval(300), (x, y) => x));
const example = source.pipe(distinct(v => v.value));
example.subscribe({
  next: console.log,
  complete: console.log.bind(console, 'complete')
});
