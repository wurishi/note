// 09-concat

const Rx = require('rxjs');
const Operators = require('rxjs/operators');

const source = Rx.interval(1000).pipe(Operators.take(3));
const source2 = Rx.of(3);
const source3 = Rx.of(4, 5, 6);

const example = source.pipe(Operators.concat(source2, source3));
example.subscribe(console.log, console.log, () => console.log('complete'));
