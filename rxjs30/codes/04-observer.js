// 04-observer

class Producer {
  constructor() {
    this.listeners = [];
  }

  addListener(listener) {
    if (typeof listener === 'function') {
      this.listeners.push(listener);
    }
  }

  removeListener(listener) {
    this.listeners.splice(this.listeners.indexOf(listener), 1);
  }

  notify(message) {
    this.listeners.forEach(listener => listener(message));
  }
}

const egghead = new Producer();

egghead.addListener(msg => console.log(`${msg} from listener1`));
egghead.addListener(msg => console.log(`${msg} from listener2`));

egghead.notify('哈哈');

module.exports = Producer;
