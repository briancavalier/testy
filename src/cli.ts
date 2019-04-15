import { discoverTests } from './discover'
import { evaluateTests } from './evaluate'
import { report, reportJson } from './report'
import getopts from 'getopts'
import glob from 'tiny-glob'

export async function* findTestFiles(cwd: string, globs: string[]): AsyncIterable<string[]> {
  const options = { absolute: true, filesOnly: true, cwd }
  for (const g of globs) yield glob(g, options)
}

export async function* flattenIterable<A>(aia: AsyncIterable<Iterable<A>>): AsyncIterable<A> {
  for await (const aa of aia) yield* aa
}

const cwd = process.cwd()
const argv = getopts(process.argv.slice(2))
const events = evaluateTests(discoverTests(flattenIterable(findTestFiles(cwd, argv._))))
const result = argv.report === 'json'
  ? reportJson(process.stdout, events)
  : report(cwd, process.stdout, events)

result.then(code => {
  process.exit(code)
}).catch(e => {
  console.error(e)
  process.exit(1)
})
