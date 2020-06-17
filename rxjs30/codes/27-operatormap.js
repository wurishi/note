class Observable {
  _subscribe;
  source = null;
  operator = null;

  constructor(subscribe) {
    subscribe && (this._subscribe = subscribe);
  }

  subscribe() {
    const observer = new Observer(...arguments);
    if (this.operator) {
      this.operator.call(observer, this.source);
    } else {
      this._subscribe(observer);
    }
    return observer;
  }

  // 执行 map 返回一个新的 observable, 包含了源指向(指向自己), 和一个operator.
  // 执行 subscribe 时, 如果有 operator 则执行, subscribe 会有源负责在最后执行
  map(callback) {
    const observable = new Observable();
    observable.source = this;
    observable.operator = {
      call: (observer, source) => {
        const newObserver = new MapObserver(observer, callback);
        return source.subscribe(newObserver);
      },
    };
    return observable;
  }
}

Observable.fromArray = function (array) {
  if (!Array.isArray(array)) {
    throw new Error('传入的参数必须是数组');
  }
  return new Observable(function (observer) {
    try {
      array.forEach((value) => observer.next(value));
      observer.complete();
    } catch (error) {
      observer.error(error);
    }
  });
};

class Observer {
  destination = null;
  isStopped = false;

  constructor(destinationOrNext, error, complete) {
    switch (arguments.length) {
      case 0:
        // 空的 observer
        this.destination = this.safeObserver(emptyObserver);
        break;
      case 1:
        if (!destinationOrNext) {
          // 空的 observer
          this.destination = this.safeObserver(emptyObserver);
          break;
        }
        if (destinationOrNext instanceof Observer) {
          this.destination = destinationOrNext;
          break;
        }
        if (typeof destinationOrNext === 'object') {
          // 传入了一个对象
          this.destination = this.safeObserver(destinationOrNext);
        }
      default:
        // 如果都不是, 表示输入了一到三个 function
        this.destination = this.safeObserver(
          destinationOrNext,
          error,
          complete
        );
        break;
    }
  }

  safeObserver(observerOrNext, error, complete) {
    let next;
    if (typeof observerOrNext === 'function') {
      next = observerOrNext;
    } else if (observerOrNext) {
      next = observerOrNext.next || (() => {});
      error =
        observerOrNext.error ||
        function (err) {
          throw err;
        };
      complete = observerOrNext.complete || (() => {});
    }
    return {
      next,
      error,
      complete,
    };
  }

  next(value) {
    if (!this.isStopped && this.destination.next) {
      try {
        this.destination.next(value);
      } catch (error) {
        this.unsubscribe();
        throw error;
      }
    }
  }

  error(err) {
    if (!this.isStopped && this.destination.error) {
      try {
        this.destination.error(err);
      } catch (anotherError) {
        this.unsubscribe();
        throw anotherError;
      }
      this.unsubscribe();
    }
  }

  complete() {
    if (!this.isStopped && this.destination.complete) {
      try {
        this.destination.complete();
      } catch (error) {
        this.unsubscribe();
        throw error;
      }
      this.unsubscribe();
    }
  }

  unsubscribe() {
    this.isStopped = true;
  }
}

class MapObserver extends Observer {
  // 不应该叫 MapObserver, 其实是有了一个新的外部自定义的callback
  // 当执行 next 的时候, 其实是在执行 next 之前, 先执行了 callback.
  callback = null;

  constructor(observer, callback) {
    super(observer);
    this.callback = callback;
    this.next = this.next.bind(this);
  }
  next(value) {
    try {
      this.destination.next(this.callback(value));
    } catch (error) {
      this.destination.error(err);
      return;
    }
  }
}

const observable = Observable.fromArray([1, 2, 3, 4, 5]) //
  .map((v) => v * 10)
  .map((v) => 'A:' + v);
observable.subscribe((value) => console.log(value));
