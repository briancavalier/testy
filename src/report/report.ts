import { showAssertion, showError, showErrorContext, showFail, showPath, showSkip, showStack, showStats, showSummary, showTodo } from './show'
import { FileCache, findErrorLocation, getErrorContext } from '../context'
import { TestEvaluationEvent } from '../event'
import { relative } from 'path'
import { clearLine, cursorTo } from 'readline'
import { Writable } from 'stream'

const println = (s: string, w: Writable): void => {
  clearLine(w, 0)
  cursorTo(w, 0)
  w.write(`${s}\n`)
}

const updateln = (s: string, w: Writable): void => {
  clearLine(w, 0)
  cursorTo(w, 0)
  w.write(s)
}

const relativize = (base: string, path: string[]): string[] =>
  [relative(base, path[0]), ...path.slice(1)]

export async function showFileContext (e: Error, cache: FileCache, out: Writable): Promise<FileCache> {
  const l = findErrorLocation(e)
  if (!l) return cache

  const [context, updatedCache] = getErrorContext(l, cache)
  const c = await context
  println(`\n${showErrorContext(2, 2, c)}\n`, out)
  return { ...cache, ...updatedCache }
}

export async function report(basePath: string, out: Writable, events: AsyncIterable<TestEvaluationEvent>): Promise<number> {
  let files = 0
  let tests = 0
  let fail = 0
  let skip = 0
  let todo = 0
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
        updateln(showPath(relativize(basePath, event.path)), out)
        break
      case 'test:pass':
        if (event.assertions === 0) {
          fail += 1
          println(showFail(relativize(basePath, event.path), new Error('no assertions')), out)
        }
        break
      case 'test:fail':
        fail += 1
        println(showFail(relativize(basePath, event.path), event.reason), out)
        fileCache = await showFileContext(event.reason, fileCache, out)
        break
      case 'test:error':
        crash += 1
        println(showError(relativize(basePath, event.path), event.error), out)
        fileCache = await showFileContext(event.error, fileCache, out)
        println(`${showStack(event.path[0], event.error)}\n`, out)
        break
      case 'assert':
        assert += 1
        updateln(showAssertion(relativize(basePath, event.path), event.assertion), out)
        break
      case 'todo':
        tests += 1
        todo += 1
        println(showTodo(relativize(basePath, event.path)), out)
        break
    }
  }

  const elapsed = Date.now() - start
  const pass = tests - (fail + crash + skip + todo)

  updateln(`${showSummary(elapsed, pass, fail, skip, todo, crash)}\n${showStats(elapsed, files, tests, assert)}`, out)

  return fail + crash
}
