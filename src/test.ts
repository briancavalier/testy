import { Assertion } from './assert'

export type TestCase = () => AsyncIterable<Assertion> | Iterable<Assertion>

export type TestEvent =
  | { type: 'assert', label: string, assertion: Assertion }
  | { type: 'it:enter', label: string }
  | { type: 'it:leave', label: string }
  | { type: 'it:error', label: string, error: Error }
  | { type: 'it:skip', label: string }
  | { type: 'it:todo', label: string }
  | { type: 'describe:enter', label: string }
  | { type: 'describe:leave', label: string }
  | { type: 'file:enter', label: string }
  | { type: 'file:leave', label: string }

export async function* it (label: string, test: TestCase): AsyncIterable<TestEvent> {
  yield { type: 'it:enter', label }
  try {
    for await (const assertion of test()) {
      const cont = yield { type: 'assert', label, assertion }
      if (!cont) break
    }
  } catch (error) {
    yield { type: 'it:error', label, error }
  }
  yield { type: 'it:leave', label }
}

export async function* describe(label: string, tests: AsyncIterable<TestEvent>[]): AsyncIterable<TestEvent> {
  yield { type: 'describe:enter', label }
  for (const t of tests) {
    yield* t
  }
  yield { type: 'describe:leave', label }
}

export async function* test(tests: AsyncIterable<TestEvent>[]): AsyncIterable<TestEvent> {
  for (const t of tests) {
    yield* t
  }
}
