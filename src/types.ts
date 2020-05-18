export type TestTreeEvent =
  | { type: 'group:enter', path: readonly string[] }
  | { type: 'group:leave', path: readonly string[] }
  | { type: 'file:enter', path: readonly string[] }
  | { type: 'file:leave', path: readonly string[] }
  | { type: 'todo', path: readonly string[] }

export type TestDiscoveryEvent<C, T> =
  | TestTreeEvent
  | { type: 'test', path: readonly string[], context: C, test: T }

export type TestEvaluationEvent<C, A> =
  | TestTreeEvent
  | { type: 'test:skip', path: readonly string[] }
  | { type: 'test:start', path: readonly string[], context: C }
  | TestAssertionEvent<A>
  | TestEndEvent

export type TestAssertionEvent<A> = { type: 'assert', path: readonly string[], assertion: A }

export type TestEndEvent =
  | { type: 'test:pass', path: readonly string[], duration: number }
  | { type: 'test:fail', path: readonly string[], duration: number, reason: Error }
  | { type: 'test:error', path: readonly string[], duration: number, error: Error }

export type TestSpec<C, T> =
  | { type: 'group', label: string, context: C, nodes: readonly TestSpec<C, T>[] }
  | { type: 'test', label: string, context: C, test: T }
  | { type: 'todo', label: string }

export type Assertion =
  | { ok: true, message: string }
  | { ok: false, message: string, reason: Error }

export type TestContext = { timeout: number, skip: boolean }
