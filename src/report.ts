import { showAssertion, showError } from './show'
import { TestEvent } from './test'
import { relative } from 'path'
import { Writable } from 'stream'

export const println = (s: string, w: Writable): boolean =>
  w.write(`${s}\n`)

export async function reportJson(out: Writable, events: AsyncIterable<TestEvent>): Promise<void> {
  for await (const e of events) println(`${JSON.stringify(e)}`, out)
}

export async function report(cwd: string, out: Writable, events: AsyncIterable<TestEvent>): Promise<void> {
  let path = []
  let failures = []
  let errors = []
  let files = 0
  let tests = 0
  let assertions = 0

  const start = Date.now()
  for await (const event of events) {
    switch (event.type) {
      case 'file:enter':
        files += 1
        path.push(relative(cwd, event.label))
        break
      case 'group:enter':
        path.push(event.label)
        break
      case 'test:enter':
        tests += 1
        path.push(event.label)
        break
      case 'test:error':
        errors.push({ path: path.slice(), error: event.error })
        println(showError(path, event.error), out)
        break
      case 'file:leave':
      case 'group:leave':
      case 'test:leave':
        path.pop()
        break
      case 'assert':
        assertions += 1
        if (!event.assertion.ok) failures.push({ path: path.slice(), assertion: event.assertion })
        println(showAssertion(path, event.assertion), out)
        break
    }
  }

  const elapsed = Date.now() - start
  const passed = assertions - (failures.length + errors.length)
  println(`Pass:       ${passed}`, out)
  println(`Fail:       ${failures.length}`, out)
  println(`Error:      ${errors.length}`, out)
  println(`Time:       ${elapsed}ms`, out)
  println(`Files:      ${files} (${(1000 * files / elapsed).toFixed(2)} per sec)`, out)
  println(`Tests:      ${tests} (${(tests / files).toFixed(2)} per file, ${(1000 * tests / elapsed).toFixed(2)} per sec)`, out)
  println(`Assertions: ${assertions} (${(assertions / tests).toFixed(2)} per test, ${(assertions / files).toFixed(2)} per file, ${(1000 * assertions / elapsed).toFixed(2)} per sec)`, out)
}