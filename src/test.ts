export type Path = string[]

export type TestPlan<A> =
  | { type: 'Group', path: Path, tests: TestPlan<A>[] }
  | Test<A>

export type Test<A> =
  | { type: 'Test', path: Path, test: A }
  | { type: 'Todo', path: Path }

export type TestResult<A> =
  | { type: 'pass', test: A }
  | { type: 'fail', test: A, reason: Error }
  | { type: 'skip', test: A }
  | { type: 'todo', test: A }

export type Evaluate<A, R> = (a: A) => R

export type Accumulate<R, T, S> = {
  init(): T,
  tally: (t: T, r: R) => T,
  summarize: (t: T) => S
}

export const runTests = <A, R, T, S>(evaluate: Evaluate<TestPlan<A>, R>, accumulate: Accumulate<R, T, S>, tests: TestPlan<A>[]): S =>
  accumulate.summarize(foldTests(evaluate, accumulate, [], accumulate.init(), tests))

export const foldTest = <A, R, T, S> (evaluate: Evaluate<TestPlan<A>, R>, accumulate: Accumulate<R, T, S>, path: Path, t: T, test: TestPlan<A>): T =>
  test.type === 'Group'
    ? foldTests(evaluate, accumulate, [...path, ...test.path], t, test.tests)
    : accumulate.tally(t, evaluate({ ...test, path: [...path, ...test.path] }))

export const foldTests = <A, R, T, S>(evaluate: Evaluate<TestPlan<A>, R>, accumulate: Accumulate<R, T, S>, path: Path, t: T, tests: TestPlan<A>[]): T =>
  tests.reduce((t, test) => foldTest(evaluate, accumulate, path, t, test), t)
