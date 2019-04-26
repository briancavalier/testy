import { Assertion, TestSpec } from './types'

export type RunTest = () => AsyncIterable<Assertion>

export const describe = <C, T>(label: string, node: TestSpec<C, T>, ...nodes: TestSpec<C, T>[]): TestSpec<C, T> =>
  ({ type: 'group', label, context: {}, nodes: [node, ...nodes] })

export function it<C, T>(label: string): TestSpec<C, null>
export function it<C, T>(label: string, test: T): TestSpec<C, T>
export function it<C, T>(label: string, test?: T): TestSpec<C, T> | TestSpec<C, null> {
  return test
    ? { type: 'test', label, context: {}, test }
    : { type: 'test', label, context: {}, test: null }
}
