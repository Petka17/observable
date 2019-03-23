import Observable from "../index";

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
