import { Assertion, TestContext, TestSpec } from './types'

export type RunTest = () => AsyncIterable<Assertion>

export const test = <C, T>(label: string, node: TestSpec<C, T>, ...nodes: TestSpec<C, T>[]): TestSpec<C, T> =>
  ({ type: 'group', label, context: {}, nodes: [node, ...nodes] })

export function it<T>(label: string): TestSpec<TestContext, null>
export function it<T>(label: string, test: T): TestSpec<TestContext, T>
export function it<T>(label: string, test?: T): TestSpec<TestContext, T> | TestSpec<TestContext, null> {
  return test
    ? { type: 'test', label, context: { shouldSkip: label.trim().startsWith('//') }, test }
    : { type: 'test', label, context: {}, test: null }
}
