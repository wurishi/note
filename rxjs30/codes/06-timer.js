// 06-timer

const Rx = require('rxjs');

// Rx.timer(等待时间ms, 间隔时间ms)
const source = Rx.timer(1000, 5000);
// 等待时间还可以是一个日期类型 (Date)

const createObserver = name => ({
  next(value) {
    console.log(name, value);
  },
  error(err) {
    console.log(name, err);
  },
  complete() {
    console.log(name, 'complete');
  }
});

source.subscribe(createObserver('timer'));

// 只传一个参数的话, 类似 setTimeout, 在等待时间后执行一次就结束了.
const oneTime = Rx.timer(1000);
oneTime.subscribe(createObserver('oneTime'));
