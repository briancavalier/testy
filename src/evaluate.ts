import { TestDiscoveryEvent, TestEvaluationEvent } from './event'
import { TestCase } from './test'

const shouldSkip = (path: string[]): boolean =>
  path.some(p => p.trim().startsWith('//'))

export async function* evaluateTests(events: AsyncIterable<TestDiscoveryEvent>): AsyncIterable<TestEvaluationEvent> {
  for await (const event of events) {
    switch (event.type) {
      case 'test':
        if (shouldSkip(event.path)) {
          yield { type: 'test:skip', path: event.path }
        } else {
          yield* evaluateTestCase(event.path, event.test)
        }
        break

      default:
        yield event
        break
    }
  }
}

export async function* evaluateTestCase(path: string[], test: TestCase): AsyncIterable<TestEvaluationEvent> {
  yield { type: 'test:enter', path }
  let assertions = 0
  try {
    for await (const assertion of test()) {
      assertions += 1
      yield { type: 'assert', path, assertion }
      if (!assertion.ok) break
    }
  } catch (error) {
    yield { type: 'test:error', path, error }
  }
  yield { type: 'test:leave', path, assertions }
}