import { Accumulate, Test, TestResult } from './test'

type Writable = {
  write(s: string): void
}

const append = (s: string, w: Writable): Writable => {
  w.write(s)
  return w
}

const renderTap = <A>(n: number, r: TestResult<Test<A>>): string => {
  const p = r.test.path.join(' > ')
  return r.type === 'pass' ? `ok ${n} ${p}`
    : r.type === 'skip' ? `ok ${n} ${p} # skip`
      : r.type === 'todo' ? `not ok ${n} ${p} # todo`
        : `not ok ${n} ${p}`
}

export const tap = <A>(w: Writable): Accumulate<TestResult<Test<A>>, [number, Writable], Writable> => {
  return {
    init: () => [0, w],
    tally: ([n, w], r) => [n + 1, append(`${renderTap(n, r)}\n`, w)],
    summarize: ([n, w]) => append(`1..${n}`, w)
  }
}