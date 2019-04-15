import { TestEvaluationEvent } from './event'
import { showAssertion, showError } from './show'
import { relative } from 'path'
import { Writable } from 'stream'

export const println = (s: string, w: Writable): boolean =>
  w.write(`${s}\n`)

export const relativize = (base: string, path: string[]): string[] =>
  [relative(base, path[0]), ...path.slice(1)]

export async function reportJson(out: Writable, events: AsyncIterable<TestEvaluationEvent>): Promise<number> {
  for await (const event of events) println(`${JSON.stringify(event)}`, out)
  return 0
}

export async function report(basePath: string, out: Writable, events: AsyncIterable<TestEvaluationEvent>): Promise<number> {
  let failures = []
  let errors = []
  let files = 0
  let tests = 0
  let assertions = 0
  let testAssertions = 0

  const start = Date.now()
  for await (const event of events) {
    switch (event.type) {
      case 'file:enter':
        files += 1
        break
      case 'test:enter':
        tests += 1
        break
      case 'test:leave':
        if(testAssertions === 0) {
          println(showError(relativize(basePath, event.path), new Error('no assertions')), out)
        }
        testAssertions = 0
        break
      case 'test:error':
        errors.push(event)
        println(showError(relativize(basePath, event.path), event.error), out)
        break
      case 'assert':
        assertions += 1
        testAssertions += 1
        if (!event.assertion.ok) failures.push(event)
        println(showAssertion(relativize(basePath, event.path), event.assertion), out)
        break
    }
  }

  const elapsed = Date.now() - start
  const passed = assertions - (failures.length + errors.length)

  println(`\n${passed} passed, ${failures.length} failed, ${errors.length} crashed\n`, out)
  println(`Time:       ${elapsed}ms`, out)
  println(`Files:      ${files} (${(1000 * files / elapsed).toFixed(2)} per sec)`, out)
  println(`Tests:      ${tests} (${(tests / files).toFixed(2)} per file, ${(1000 * tests / elapsed).toFixed(2)} per sec)`, out)
  println(`Assertions: ${assertions} (${(assertions / tests).toFixed(2)} per test, ${(assertions / files).toFixed(2)} per file, ${(1000 * assertions / elapsed).toFixed(2)} per sec)`, out)

  return failures.length + errors.length
}