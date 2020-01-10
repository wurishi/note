// 06-fromeventpattern

const Rx = require('rxjs');
const Producer = require('./04-observer');

const egghead = new Producer();

const source = Rx.fromEventPattern(
  handler => egghead.addListener(handler),
  handler => egghead.removeListener(handler)
);

source.subscribe(value => console.log(value));

egghead.notify('Hello! Can you hear me?');
