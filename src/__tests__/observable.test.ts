import { getByLabelText, fireEvent } from "dom-testing-library";
import Observable from "../index";

test("of with not array", () => {
  let complete = false;

  const sub = Observable.of("123").subscribe({
    next(v) {
      expect(v).toEqual("123");
    },
    complete() {
      complete = true;
    }
  });

  sub.unsubscribe();

  expect(complete).toBe(true);
});

test("of with array", () => {
  let complete = false;
  const arr = [1, 2, 3];
  let res = [];

  Observable.of(arr).subscribe({
    next(v) {
      res.push(v);
    },
    complete() {
      complete = true;
    }
  });

  expect(res).toEqual(arr);
  expect(complete).toBe(true);
});

test("fail", done => {
  const msg = "error";

  const sub = Observable.fail(msg).subscribe({
    next() {
      done.fail("no value expected");
    },
    error(err) {
      expect(err.message).toBe(msg);
    }
  });

  sub.unsubscribe();

  done();
});

test("timeout", done => {
  let k = false;

  Observable.timeout(500).subscribe({
    next() {
      k = true;
    },
    complete() {
      expect(k).toBe(true);
      done();
    }
  });
});

test("timeout with unsubscribe", done => {
  jest.useFakeTimers();
  const sub = Observable.timeout(500).subscribe({
    next() {
      done.fail("no next");
    },
    complete() {
      done.fail("no complete");
    }
  });
  sub.unsubscribe();
  jest.runAllTimers();

  done();
});

test("map", () => {
  let complete = false;
  const arr = [1, 2, 3];
  const projectionFn = (x: number) => x * 2;
  let res = [];

  Observable.of(arr)
    .map(projectionFn)
    .subscribe({
      next(v) {
        res.push(v);
      },
      complete() {
        complete = true;
      }
    });

  expect(res).toEqual(arr.map(projectionFn));
  expect(complete).toBe(true);
});

test("map over failed observable", done => {
  const msg = "error";
  const projectionFn = (x: number) => x * 2;

  Observable.fail(msg)
    .map(projectionFn)
    .subscribe({
      next() {
        done.fail("no next");
      },
      error(err) {
        expect(err.message).toBe(msg);
      },
      complete() {
        done.fail("no complete");
      }
    });

  done();
});

test("map failed projection", done => {
  const projectionFn = (x: string) => x.toUpperCase();
  const res = [];
  const arr = ["a", "b"];

  Observable.of([...arr, 1])
    .map(projectionFn)
    .subscribe({
      next(v) {
        res.push(v);
      },
      error(err) {
        expect(err.message).toBe("x.toUpperCase is not a function");
      },
      complete() {
        // done.fail("no complete");
      }
    });

  expect(res).toEqual(arr.map(projectionFn));
  done();
});

test("filter", () => {
  let complete = false;
  const arr = [1, 2, 3];
  const predicateFn = (x: number) => x % 2 === 1;
  let res = [];

  Observable.of(arr)
    .filter(predicateFn)
    .subscribe({
      next(v) {
        res.push(v);
      },
      complete() {
        complete = true;
      }
    });

  expect(res).toEqual(arr.filter(predicateFn));
  expect(complete).toBe(true);
});

test("filter over failed observable", done => {
  const msg = "error";
  const predicateFn = (x: number) => x % 2 === 0;

  Observable.fail(msg)
    .filter(predicateFn)
    .subscribe({
      next() {
        done.fail("no next");
      },
      error(err) {
        expect(err.message).toBe(msg);
      },
      complete() {
        done.fail("no complete");
      }
    });

  done();
});

test("filter failed projection", done => {
  const predicateFn = (x: number) => Number(x.toFixed()) > 0;
  const res = [];
  const arr = [1, 2.2, 0];

  Observable.of([...arr, "a"])
    .filter(predicateFn)
    .subscribe({
      next(v) {
        res.push(v);
      },
      error(err) {
        expect(err.message).toBe("x.toFixed is not a function");
      },
      complete() {
        // done.fail("no complete");
      }
    });

  expect(res).toEqual(arr.filter(predicateFn));
  done();
});

// TODO: add test for fromEvent
test("fromEvent", done => {
  const msg = "test";
  const div = document.createElement("div");
  div.innerHTML = `
    <label for="username">Username</label>
    <input id="username" />
    <button>Print Username</button>`;

  const input = getByLabelText(div, "Username");

  const events = Observable.fromEvent("change", div);

  const sub = events.subscribe({
    next(ev: Event) {
      expect((<HTMLInputElement>ev.target).value).toBe(msg);
      sub.unsubscribe();
      done();
    }
  });

  fireEvent.change(input, { target: { value: msg } });
});
