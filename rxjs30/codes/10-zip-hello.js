// 10-zip-hello
const Rx = require('rxjs');
const zip = require('rxjs/operators').zip;

const source = Rx.from('hello');
const source2 = Rx.interval(100);
const example = source.pipe(zip(source2, (x, y) => x));
example.subscribe(console.log);
