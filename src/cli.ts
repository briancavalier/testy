import { discoverTests } from './discover'
import { evaluateTests } from './evaluate'
import { writeJson as streamJson } from './json'
import glob from 'tiny-glob'

export async function* findTestFiles(cwd: string, globs: string[]): AsyncIterable<string> {
  const options = { absolute: true, filesOnly: true, cwd }
  for (const g of globs) {
    yield* await glob(g, options)
  }
}

const argv = process.argv.slice(2)
const events = evaluateTests(discoverTests(findTestFiles(process.cwd(), argv)))

streamJson(process.stdout, events).then(code => {
  process.exit(code)
}).catch(e => {
  console.error(e)
  process.exit(1)
})
