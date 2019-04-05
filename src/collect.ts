import { Accumulate, TestResult } from './test'

export type TestResults<A> = {
  pass: A[],
  fail: A[],
  skip: A[],
  todo: A[]
}

export const emptyResults = <A>(): TestResults<A> => ({
  pass: [],
  fail: [],
  skip: [],
  todo: []
})

export const updateResults = <A>(r: TestResult<A>, rs: TestResults<TestResult<A>>): TestResults<TestResult<A>> => {
  switch (r.type) {
    case 'pass': return { ...rs, pass: [...rs.pass, r] }
    case 'fail': return { ...rs, fail: [...rs.fail, r] }
    case 'skip': return { ...rs, skip: [...rs.skip, r] }
    case 'todo': return { ...rs, todo: [...rs.todo, r] }
  }
}

export type TestResultSummary<A> = {
  pass: number,
  fail: A[],
  skip: number,
  todo: number
}

export const summarizeResults = <A>(r: TestResults<TestResult<A>>): TestResultSummary<TestResult<A>> =>
  ({ pass: r.pass.length, fail: r.fail, skip: r.skip.length, todo: r.todo.length })

export const collect = <A>(): Accumulate<TestResult<A>, TestResults<TestResult<A>>, TestResultSummary<TestResult<A>>> => ({
  init: emptyResults,
  tally: (t, r) => updateResults(r, t),
  summarize: t => summarizeResults(t)
})

export const accumAsync = <R, T, S> (a: Accumulate<R, T, S>): Accumulate<Promise<R>, Promise<T>, Promise<S>> => ({
  init: async () => a.init(),
  tally: async (tp, rp) => a.tally(await tp, await rp),
  summarize: async t => a.summarize(await t)
})
