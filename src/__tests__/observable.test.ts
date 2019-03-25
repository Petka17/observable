import Observable from "../index";

test("of with not array", () => {
  let complete = false;

  Observable.of("123").subscribe({
    next(v) {
      expect(v).toEqual("123");
    },
    complete() {
      complete = true;
    }
  });

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
