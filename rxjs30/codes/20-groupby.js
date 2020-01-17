// 20-groupby

const Rx = require('rxjs');
const { take, groupBy } = require('rxjs/operators');

const source = Rx.interval(300).pipe(take(5));

const example = source.pipe(groupBy(x => x % 2));
example.subscribe(console.log);
