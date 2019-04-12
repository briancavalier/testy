import { Assertion } from './assert'

export type TestCase = () => AsyncIterable<Assertion> | Iterable<Assertion>

export type TestEvent =
  | { type: 'assert', label: string, assertion: Assertion }
  | { type: 'test:enter', label: string }
  | { type: 'test:leave', label: string }
  | { type: 'test:error', label: string, error: Error }
  | { type: 'group:enter', label: string }
  | { type: 'group:leave', label: string }
  | { type: 'file:enter', label: string }
  | { type: 'file:leave', label: string }

export async function* it (label: string, test: TestCase): AsyncIterable<TestEvent> {
  const cont = yield { type: 'test:enter', label }
  if (cont) {
    try {
      for await (const assertion of test()) {
        const cont = yield { type: 'assert', label, assertion }
        if (!cont) break
      }
    } catch (error) {
      yield { type: 'test:error', label, error }
    }
  }
  yield { type: 'test:leave', label }
}

export async function* describe(label: string, tests: AsyncIterable<TestEvent>[]): AsyncIterable<TestEvent> {
  const cont = yield { type: 'group:enter', label }
  if (cont) {
    for (const t of tests) {
      yield* t
    }
  }
  yield { type: 'group:leave', label }
}
