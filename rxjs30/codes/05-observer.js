const Rx = require('rxjs');

const observable = Rx.Observable.create(observer => {
  // complete 之后的 next 将不再执行
  // observer.next('Jerry');
  // observer.next('Anna');
  // observer.complete();
  // observer.next('not work');

  // error
  try {
    observer.next('Jerry');
    observer.next('Anna');
    throw 'some exception';
  } catch (error) {
    observer.error(error);
  }
});

const observer = {
  next(value) {
    console.log(value);
  },
  error(error) {
    console.log(error);
  },
  complete() {
    console.log('complete');
  }
};

observable.subscribe(observer);
