const Rx = require('rxjs');

const source = Rx.from('Hello');

source.subscribe(value => console.log(value));
