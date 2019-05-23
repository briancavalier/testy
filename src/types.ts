export type TestTreeEvent =
  | { type: 'group:enter', path: string[] }
  | { type: 'group:leave', path: string[] }
  | { type: 'file:enter', path: string[] }
  | { type: 'file:leave', path: string[] }
  | { type: 'todo', path: string[] }

export type TestDiscoveryEvent<C, T> =
  | TestTreeEvent
  | { type: 'test', path: string[], context: C, test: T }

export type TestEvaluationEvent<C, A> =
  | TestTreeEvent
  | { type: 'test:skip', path: string[] }
  | { type: 'test:start', path: string[], context: C }
  | { type: 'test:pass', path: string[] }
  | { type: 'test:fail', path: string[], reason: Error }
  | { type: 'test:error', path: string[], error: Error }
  | { type: 'assert', path: string[], assertion: A }

export type TestSpec<C, T> =
  | { type: 'group', label: string, context: C, nodes: TestSpec<C, T>[] }
  | { type: 'test', label: string, context: C, test: T }
  | { type: 'todo', label: string }

export type Assertion =
  | { ok: true, message: string }
  | { ok: false, message: string, reason: Error }

export type TestContext = { timeout: number, skip: boolean }
