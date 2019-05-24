import { Writable } from 'stream'
import glob from 'tiny-glob'

import { discoverTests } from '../discover'
import { evaluateTests } from '../evaluate'
import { TestContext } from '../types'
import { toJson } from './json'

const defaultContext: TestContext = { timeout: 200, skip: false }

export async function* findTestFiles(cwd: string, globs: ReadonlyArray<string>): AsyncIterable<string> {
  const options = { absolute: true, filesOnly: true, cwd }
  for (const g of globs) {
    yield* await glob(g, options)
  }
}

export async function writeLines(w: Writable, s: AsyncIterable<string>): Promise<void> {
  for await (const event of s) w.write(`${event}\n`)
}

const argv = process.argv.slice(2)
const events = evaluateTests(discoverTests(defaultContext, findTestFiles(process.cwd(), argv)))

writeLines(process.stdout, toJson(events)).then(() => {
  process.exit(0)
}).catch(e => {
  console.error(e)
  process.exit(1)
})
