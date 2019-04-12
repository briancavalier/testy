import { report } from './report'
import { TestEvent } from './test'
import glob from 'tiny-glob'

const GLOB_OPTIONS = { absolute: true, filesOnly: true }

export async function* findTestFiles(globs: string[]): AsyncIterable<string[]> {
  for (const g of globs) yield glob(g, GLOB_OPTIONS)
}

export async function* flattenIterable <A>(aia: AsyncIterable<Iterable<A>>): AsyncIterable<A> {
  for await (const aa of aia) yield* aa
}

export async function* runTestFile(f: string): AsyncIterable<TestEvent> {
  const cont = yield { type: 'file:enter', label: f }
  if (cont) {
    yield* require(f).default
  }
  yield { type: 'file:leave', label: f }
}

export async function* runTests(files: AsyncIterable<string>): AsyncIterable<TestEvent> {
  for await (const file of files) {
    const it = runTestFile(file)[Symbol.asyncIterator]()
    let r = await it.next()
    while (!r.done) {
      const event = r.value
      let cont = true
      switch (event.type) {
        case 'test:enter':
          cont = !event.label.trim().startsWith('//')
          break
        case 'assert':
          cont = event.assertion.ok
          break
      }

      yield event

      r = await it.next(cont)
    }
  }
}

const testFiles = flattenIterable(findTestFiles(process.argv.slice(2)))
report(process.cwd(), process.stdout, runTests(testFiles))
