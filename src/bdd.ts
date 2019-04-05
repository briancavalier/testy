import { Test, TestPlan, TestResult } from './test'

export const describe = <A>(label: string, tests: TestPlan<A>[]): TestPlan<A> =>
  ({ type: 'Group', path: [label], tests })

export const it = <A>(label: string, test: A): TestPlan<A> =>
  ({ type: 'Test', path: [label], test })

export const todo = <A>(label: string): TestPlan<A> =>
  ({ type: 'Todo', path: [label] })

export type TestF<A> = () => A | Promise<A>

const tryTest = async <A>(t: Test<TestF<A>>, test: TestF<A>): Promise<TestResult<Test<TestF<A>>>> => {
  try {
    await test()
    return { type: 'pass', test: t }
  } catch (e) {
    return { type: 'fail', test: t, reason: e }
  }
}

const shouldSkip = <A>(t: Test<TestF<A>>): boolean =>
  t.path.some(s => s.startsWith('//'))

export const tryTestFunction = async <A>(t: Test<TestF<A>>): Promise<TestResult<Test<TestF<A>>>> =>
  shouldSkip(t) ? { type: 'skip', test: t }
    : t.type === 'Todo' ? { type: 'todo', test: t }
      : tryTest(t, t.test)