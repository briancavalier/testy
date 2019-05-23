import { RunTest } from './describe'
import { Assertion, TestContext, TestDiscoveryEvent, TestEvaluationEvent } from './types'

export async function* evaluateTests(events: AsyncIterable<TestDiscoveryEvent<TestContext, RunTest>>): AsyncIterable<TestEvaluationEvent<TestContext, Assertion>> {
  for await (const event of events) {
    switch (event.type) {
      case 'test':
        const { path, context } = event
        if (context.skip) {
          yield { type: 'test:skip', path }
        } else {
          yield { type: 'test:start', path, context }
          yield* evaluateTestCase(event.path, context.timeout, event.test())
        }
        break

      default:
        yield event
        break
    }
  }
}

export async function* evaluateTestCase<C>(path: string[], timeout: number, test: AsyncIterable<Assertion>): AsyncIterable<TestEvaluationEvent<C, Assertion>> {
  try {
    let assertions = 0
    const deadline = Date.now() + timeout
    for await (const assertion of test) {
      assertions += 1
      yield { type: 'assert', path, assertion }

      if (!assertion.ok) {
        yield { type: 'test:fail', path, reason: assertion.reason }
        return
      }

      if (Date.now() > deadline) {
        yield { type: 'test:fail', path, reason: new Error(`${timeout}ms time budget exceeded`) }
        return
      }
    }

    yield assertions === 0
      ? { type: 'test:fail', path, reason: new Error('no assertions') }
      : { type: 'test:pass', path }
  } catch (error) {
    yield { type: 'test:error', path, error }
  }
}
