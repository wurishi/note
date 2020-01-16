const Rx = require('rxjs');
const Operators = require('rxjs/operators');

const source = Rx.interval(1000);
source.pipe(Operators.map(v => v * 2)).subscribe(console.log);
