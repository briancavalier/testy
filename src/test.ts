import { Assertion } from './assert'

export type TestCase = () => AsyncIterable<Assertion>

export type TestSpec<T> =
  | { type: 'group', label: string, nodes: TestSpec<T>[] }
  | { type: 'test', label: string, test: T }

export const it = (label: string, test: TestCase): TestSpec<TestCase> =>
  ({ type: 'test', label, test })

export const describe = <T> (label: string, ...nodes: TestSpec<T>[]): TestSpec<T> =>
  ({ type: 'group', label, nodes })
