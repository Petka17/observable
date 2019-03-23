interface Observer {
  next: Function;
  error?: Function;
  complete?: Function;
}

type Subscribe = (observer: Observer) => void;

class Observable {
  _subscribe: Subscribe;

  constructor(subscribe) {
    this._subscribe = subscribe;
  }

  subscribe(observer: Observer) {
    return this._subscribe(observer);
  }

  static timeout(time: number) {
    return new Observable(function subscribe(observer: Observer) {
      const timer = setTimeout(function() {
        observer.next();
        observer.complete();
      }, time);

      return {
        unsubscribe() {
          clearTimeout(timer);
        }
      };
    });
  }
}

const obs = Observable.timeout(500);

obs.subscribe({
  next() {
    console.log("next 1");
  },
  complete() {
    console.log("complete 1");
  }
});

setTimeout(function() {
  obs.subscribe({
    next() {
      console.log("next 2");
    },
    complete() {
      console.log("complete 2");
    }
  });
}, 1000);
