interface Observer {
  next: (data?: any) => void;
  error?: (err: Error) => void;
  complete?: () => void;
}

interface Subscription {
  unsubscribe: Function;
}

type SubscribeFn = (observer: Observer) => Subscription;
type PredicateFn = (v: any) => boolean;

class Observable {
  private _subscribe: SubscribeFn;

  constructor(subscribe: SubscribeFn) {
    this._subscribe = subscribe;
  }

  subscribe(observer: Observer): Subscription {
    return this._subscribe(observer);
  }

  static of(value: any) {
    return new Observable(function subscribe(observer: Observer) {
      if (value instanceof Array) {
        value.forEach(v => observer.next(v));
      } else {
        observer.next(value);
      }

      observer.complete();

      return {
        unsubscribe() {}
      };
    });
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

  static fromEvent(dom: HTMLElement, eventName: string) {
    return new Observable(function subscribe(observer: Observer) {
      const handle = (ev: Event) => {
        observer.next(ev);
      };

      dom.addEventListener(eventName, handle);

      return {
        unsubscribe() {
          dom.removeEventListener(eventName, handle);
        }
      };
    });
  }

  public map(projection: Function) {
    const self = this;

    return new Observable(function subscribe(observer: Observer) {
      return self.subscribe({
        next(v: any) {
          try {
            observer.next(projection(v));
          } catch (err) {
            observer.error(err);
          }
        },
        error(err: Error) {
          observer.error(err);
        },
        complete() {
          observer.complete();
        }
      });
    });
  }

  public filter(predicate: PredicateFn) {
    const self = this;

    return new Observable(function subscribe(observer: Observer) {
      return self.subscribe({
        next(v: any) {
          try {
            if (predicate(v)) {
              observer.next(v);
            }
          } catch (err) {
            observer.error(err);
          }
        },
        error(err: Error) {
          observer.error(err);
        },
        complete() {
          observer.complete();
        }
      });
    });
  }
}

export default Observable;
