import { FileCache, findErrorLocation, getErrorContext } from './context'
import { TestEvaluationEvent } from './event'
import { showAssertion, showError, showErrorContext, showFileLink, showPath, showSkip, showStack, showSummary } from './show'
import { relative } from 'path'
import { Writable } from 'stream'

const println = (s: string, w: Writable): boolean =>
  w.write(`\n${s}`)

const relativize = (base: string, path: string[]): string[] =>
  [relative(base, path[0]), ...path.slice(1)]

export async function showFileContext (e: Error, cache: FileCache, out: Writable): Promise<FileCache> {
  const l = findErrorLocation(e)
  if (!l) return cache

  const [context, updatedCache] = getErrorContext(l, cache)
  const c = await context
  if (c) {
    println(`\n${showFileLink(c)}`, out)
    println(`\n${showErrorContext(2, 2, c)}\n`, out)
  }

  return { ...cache, ...updatedCache }
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
          fileCache = await showFileContext(event.assertion.failure, fileCache, out)
        }
        break
    }
  }

  const elapsed = Date.now() - start
  const pass = tests - (fail + crash + skip)

  println(`\n${showSummary(pass, fail, skip, crash)}\n`, out)
  println(`time:       ${elapsed}ms`, out)
  println(`files:      ${files} (${(1000 * files / elapsed).toFixed(2)} per sec)`, out)
  println(`tests:      ${tests} (${(tests / files).toFixed(2)} per file, ${(1000 * tests / elapsed).toFixed(2)} per sec)`, out)
  println(`assertions: ${assert} (${(assert / tests).toFixed(2)} per test, ${(assert / files).toFixed(2)} per file, ${(1000 * assert / elapsed).toFixed(2)} per sec)`, out)

  return fail + crash
}

type ErrorJson = {
  name: string | undefined,
  message: string,
  stack: string | undefined
}

export async function reportJson(out: Writable, events: AsyncIterable<TestEvaluationEvent>): Promise<number> {
  for await (const event of events) {
    println(JSON.stringify(event, serializeErrors), out)
  }

  return 0
}

const serializeErrors = (key: string, value: any): any =>
  value instanceof Error ? errorToJson(value) : value

const errorToJson = (e: Error): ErrorJson =>
  ({ name: e.name, message: e.message, stack: e.stack })