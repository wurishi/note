const emptyObserver = {
  next: () => {},
  error: (err) => {
    throw err;
  },
  complete: () => {},
};

module.exports.Observer = class Observer {
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
};
