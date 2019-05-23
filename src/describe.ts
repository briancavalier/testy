import { Assertion, TestContext, TestSpec } from './types'

export type RunTest = () => AsyncIterable<Assertion>

export const describe = <C, T>(label: string, node: TestSpec<Partial<C>, T>, ...nodes: TestSpec<Partial<C>, T>[]): TestSpec<Partial<C>, T> =>
  ({ type: 'group', label, context: {}, nodes: [node, ...nodes] })

export const it = <T>(label: string, test?: T): TestSpec<Partial<TestContext>, T> =>
  test ? { type: 'test', label, context: { skip: label.trim().startsWith('//') }, test }
    : { type: 'todo', label }
