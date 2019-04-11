import { print, showAssertion, showError, showPath } from './show'
import { TestEvent } from './test'
import { relative } from 'path'
import { Writable } from 'stream'
import glob from 'tiny-glob'

const GLOB_OPTIONS = { absolute: true, filesOnly: true }

export async function* findTestFiles(globs: string[]): AsyncIterable<string[]> {
  for (const g of globs) {
    yield glob(g, GLOB_OPTIONS)
  }
}

export async function* runTestFiles(files: string[]): AsyncIterable<TestEvent> {
  for (const f of files) {
    yield { type: 'file:enter', label: f }
    const test = require(f).default
    yield* test
    yield { type: 'file:leave', label: f }
  }
}

export async function run(cwd: string, globs: string[], out: Writable): Promise<void> {
  let path = []
  let failures = []
  let errors = []
  let files = 0
  let tests = 0
  let assertions = 0

  const start = Date.now()
  for await (const fileset of findTestFiles(globs)) {
    const it = runTestFiles(fileset)[Symbol.asyncIterator]()
    let r = await it.next()
    while(!r.done) {
      const event = r.value
      let cont = true
      switch (event.type) {
        case 'file:enter':
          files += 1
          path.push(relative(cwd, event.label))
          break
        case 'describe:enter':
          path.push(event.label)
          break
        case 'it:enter':
          tests += 1
          path.push(event.label)
          break
        case 'it:error':
          errors.push({ path: path.slice(), error: event.error })
          print(showError(path, event.error), out)
          break
        case 'file:leave':
        case 'describe:leave':
        case 'it:leave':
          path.pop()
          break
        case 'assert':
          assertions += 1
          cont = event.assertion.ok
          if (!event.assertion.ok) failures.push({ path: path.slice(), assertion: event.assertion })
          print(showAssertion(path, event.assertion), out)
          break
        default:
          print(showPath(path), out)
      }

      r = await it.next(cont)
    }
  }

  const passed = assertions - (failures.length + errors.length)
  print(`\nPass: ${passed} Fail: ${failures.length} Error: ${errors.length} Files: ${files} Tests: ${tests} Assertions: ${assertions} (${Date.now() - start}ms)`, out)
}

run(process.cwd(), process.argv.slice(2), process.stdout)
