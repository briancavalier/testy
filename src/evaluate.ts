import { RunTest } from './describe'
import {
  Assertion, TestAssertionEvent, TestContext, TestDiscoveryEvent, TestEndEvent, TestEvaluationEvent
} from './types'

export async function* evaluateTests(events: AsyncIterable<TestDiscoveryEvent<TestContext, RunTest>>): AsyncIterable<TestEvaluationEvent<TestContext, Assertion>> {
  for await (const event of events) {
    switch (event.type) {
      case 'test':
        const { path, context } = event
        if (context.skip) {
          yield { type: 'test:skip', path }
        } else {
          yield { type: 'test:start', path, context }
          const end = yield* evaluateTestCase(event.path, context.timeout, event.test())
          yield end
        }
        break

      default:
        yield event
        break
    }
  }
}

export async function* evaluateTestCase(path: readonly string[], timeout: number, test: AsyncIterable<Assertion>): AsyncGenerator<TestAssertionEvent<Assertion>, TestEndEvent> {
  let assertions = 0
  const start = Date.now()
  try {
    const deadline = start + timeout
    for await (const assertion of test) {
      assertions += 1
      yield { type: 'assert', path, assertion }

      const now = Date.now()
      if (!assertion.ok) {
        return { type: 'test:fail', path, duration: now - start, reason: assertion.reason } as const
      }

      if (now > deadline) {
        return { type: 'test:fail', path, duration: now - start, reason: new Error(`${timeout}ms time budget exceeded`) } as const
      }
    }

    const duration = Date.now() - start
    return assertions === 0
      ? { type: 'test:fail', path, duration, reason: new Error('no assertions') } as const
      : { type: 'test:pass', path, duration } as const
  } catch (error) {
    return { type: 'test:error', path, duration: Date.now() - start, error } as const
  }
}
