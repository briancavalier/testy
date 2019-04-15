import { TestDiscoveryEvent, TestEvaluationEvent } from './event'
import { TestCase } from '.'

export async function* evaluateTests(events: AsyncIterable<TestDiscoveryEvent>): AsyncIterable<TestEvaluationEvent> {
  for await (const event of events) {
    switch (event.type) {
      case 'test':
        yield* evaluateTestCase(event.path, event.test)
        break

      default:
        yield event
        break
    }
  }
}

export async function* evaluateTestCase(path: string[], test: TestCase): AsyncIterable<TestEvaluationEvent> {
  yield { type: 'test:enter', path }
  try {
    for await (const assertion of test()) {
      yield { type: 'assert', path, assertion }
    }
  } catch (error) {
    yield { type: 'test:error', path, error }
  }
  yield { type: 'test:leave', path }
}