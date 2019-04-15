import { FileCache, getErrorContext } from './context'
import { TestEvaluationEvent } from './event'
import { showAssertion, showError, showErrorContext, showFileLink, showSkip, showStack } from './show'
import { relative } from 'path'
import { Writable } from 'stream'

const println = (s: string, w: Writable): boolean =>
  w.write(`${s}\n`)

const relativize = (base: string, path: string[]): string[] =>
  [relative(base, path[0]), ...path.slice(1)]

export async function showFileContext (e: Error, cache: FileCache, out: Writable): Promise<void> {
  const [context, updatedCache] = getErrorContext(e, cache)
  Object.assign(cache, updatedCache)
  const c = await (context)
  if (c) {
    println(`\n${showFileLink(c)}`, out)
    println(`\n${showErrorContext(2, 2, c)}\n`, out)
  }
}

export async function report(basePath: string, out: Writable, events: AsyncIterable<TestEvaluationEvent>): Promise<number> {
  let files = 0
  let tests = 0
  let fail = 0
  let skip = 0
  let crash = 0
  let assert = 0
  let fileCache: FileCache = {}

  const start = Date.now()

  for await (const event of events) {
    switch (event.type) {
      case 'file:enter':
        files += 1
        break
      case 'test:skip':
        tests += 1
        skip += 1
        println(showSkip(relativize(basePath, event.path)), out)
        break
      case 'test:start':
        tests += 1
        break
      case 'test:pass':
        if (event.assertions === 0) {
          fail += 1
          println(showError(relativize(basePath, event.path), new Error('no assertions')), out)
        }
        break
      case 'test:fail':
        fail += 1
        break
      case 'test:error':
        crash += 1
        println(showError(relativize(basePath, event.path), event.error), out)
        await showFileContext(event.error, fileCache, out)
        println(`${showStack(event.error)}\n`, out)
        break
      case 'assert':
        assert += 1
        println(showAssertion(relativize(basePath, event.path), event.assertion), out)
        if (!event.assertion.ok) {
          await showFileContext(event.assertion.failure, fileCache, out)
        }
        break
    }
  }

  const elapsed = Date.now() - start
  const pass = tests - (fail + crash + skip)

  println(`\n${pass} passed, ${fail} failed, ${skip} skipped, ${crash} crashed\n`, out)
  println(`Time:       ${elapsed}ms`, out)
  println(`Files:      ${files} (${(1000 * files / elapsed).toFixed(2)} per sec)`, out)
  println(`Tests:      ${tests} (${(tests / files).toFixed(2)} per file, ${(1000 * tests / elapsed).toFixed(2)} per sec)`, out)
  println(`Assertions: ${assert} (${(assert / tests).toFixed(2)} per test, ${(assert / files).toFixed(2)} per file, ${(1000 * assert / elapsed).toFixed(2)} per sec)`, out)

  return fail + crash
}

type ErrorJson = {
  name: string | undefined,
  message: string,
  stack: string | undefined
}

export async function reportJson(out: Writable, events: AsyncIterable<TestEvaluationEvent>): Promise<number> {
  for await (const event of events) {
    switch (event.type) {
      case 'test:error':
        println(JSON.stringify({ ...event, error: errorToJson(event.error) }), out)
        break
      case 'assert':
        if (!event.assertion.ok) {
          println(JSON.stringify({ ...event, assertion: { ...event.assertion, failure: errorToJson(event.assertion.failure) } }), out)
        } else {
          println(JSON.stringify(event), out)
        }
        break
      default:
        println(JSON.stringify(event), out)
        break
    }
  }

  return 0
}

const errorToJson = (e: Error): ErrorJson =>
  ({ name: e.name, message: e.message, stack: e.stack })