// 10-zip

const Rx = require('rxjs');
const zip = require('rxjs/operators').zip;
const take = require('rxjs/operators').take;

const source = Rx.interval(500).pipe(take(3));
const newest = Rx.interval(300).pipe(take(6));

const example = source.pipe(zip(newest, (x, y) => x + y));
example.subscribe({
  next: console.log,
  complete: console.log.bind(console, 'complete')
});
