// 20-groupby-sum

const Rx = require('rxjs');
const {
  zip,
  groupBy,
  reduce,
  mergeAll,
  concatAll,
  map
} = require('rxjs/operators');

const people = [
  { name: 'Anna', score: 100, subject: 'English' },
  { name: 'Anna', score: 90, subject: 'Math' },
  { name: 'Anna', score: 96, subject: 'Chinese' },
  { name: 'Jerry', score: 80, subject: 'English' },
  { name: 'Jerry', score: 100, subject: 'Math' },
  { name: 'Jerry', score: 90, subject: 'Chinese' }
];
const source = Rx.from(people).pipe(zip(Rx.interval(300), (x, y) => x));

const example = source.pipe(
  groupBy(p => p.name),
  map(group =>
    group.pipe(
      reduce((acc, curr) => ({
        name: curr.name,
        score: curr.score + acc.score
      }))
    )
  ),
  mergeAll()
);
example.subscribe(console.log);
