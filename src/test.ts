import { Assertion } from './assert'

export type TestSpec<T> =
  | { type: 'group', label: string, nodes: TestSpec<T>[] }
  | { type: 'test', label: string, test: T }

export const describe = <T>(label: string, node: TestSpec<T>, ...nodes: TestSpec<T>[]): TestSpec<T> =>
  ({ type: 'group', label, nodes: [node, ...nodes] })

export type RunTest = () => AsyncIterable<Assertion>
export type TestMetadata = { timeBudget: number, shouldSkip: boolean }
export type TestCase = { run: RunTest } & TestMetadata

export const defaultTestMetadata = { timeBudget: Infinity, shouldSkip: false }

export function it(label: string): TestSpec<null>
export function it(label: string, run: RunTest): TestSpec<TestCase>
export function it(label: string, run: RunTest, meta: Partial<TestMetadata>): TestSpec<TestCase>
export function it(label: string, run?: RunTest, meta: Partial<TestMetadata> = defaultTestMetadata): TestSpec<TestCase> | TestSpec<null> {
  return run
    ? { type: 'test', label, test: { run, ...defaultTestMetadata, ...meta } }
    : { type: 'test', label, test: null }
}
