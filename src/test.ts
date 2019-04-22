import { Assertion } from './assert'

export type RunTest = () => AsyncIterable<Assertion>

export type TestCase = {
  run: RunTest,
  timeBudget: number,
  shouldSkip: boolean
}

export type TestSpec<T> =
  | { type: 'group', label: string, nodes: TestSpec<T>[] }
  | { type: 'test', label: string, test: T }

export const describe = <T>(label: string, node: TestSpec<T | null>, ...nodes: TestSpec<T | null>[]): TestSpec<T | null> =>
  ({ type: 'group', label, nodes: [node, ...nodes] })

export const it = (label: string, run?: RunTest): TestSpec<TestCase | null> => ({
  type: 'test',
  label,
  test: run
    ? { run, timeBudget: Infinity, shouldSkip: false }
    : null
})
