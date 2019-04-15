import { Assertion } from './assert'

export type TestCase = () => AsyncIterable<Assertion>

export type TestSpec =
  | { type: 'group', label: string, nodes: TestSpec[] }
  | { type: 'test', label: string, test: TestCase }

export const it = (label: string, test: TestCase): TestSpec =>
  ({ type: 'test', label, test })

export const describe = (label: string, ...nodes: TestSpec[]): TestSpec =>
  ({ type: 'group', label, nodes })
