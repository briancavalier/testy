import { report, reportJson } from './report'
import { TestEvent } from './test'
import getopts from 'getopts'
import glob from 'tiny-glob'

export async function * findTestFiles (cwd: string, globs: string[]): AsyncIterable<string[]> {
  const options = { absolute: true, filesOnly: true, cwd }
  for (const g of globs) yield glob(g, options)
}

export async function * runTests (files: AsyncIterable<string>): AsyncIterable<TestEvent> {
  for await (const file of files) yield * runTestFile(file)
}

export async function * runTestFile (f: string): AsyncIterable<TestEvent> {
  const cont = yield { type: 'file:enter', label: f }
  if (cont) {
    yield * require(f).default
  }
  yield { type: 'file:leave', label: f }
}

export async function * filterTestEvents (events: AsyncIterable<TestEvent>): AsyncIterable<TestEvent> {
  const it = events[Symbol.asyncIterator]()
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

export async function * flattenIterable<A> (aia: AsyncIterable<Iterable<A>>): AsyncIterable<A> {
  for await (const aa of aia) yield * aa
}

const cwd = process.cwd()
const argv = getopts(process.argv.slice(2))
const events = filterTestEvents(runTests(flattenIterable(findTestFiles(cwd, argv._))))
const result = argv.report === 'json'
  ? reportJson(process.stdout, events)
  : report(cwd, process.stdout, events)

result.then(code => {
  process.exit(code)
}).catch(e => {
  console.error(e)
  process.exit(1)
})
