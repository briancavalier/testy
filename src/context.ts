import { readFile } from 'fs'
import { promisify } from 'util'

const readFileP = promisify(readFile)

export type Location = { column: number, line: number, file: string }
export type ErrorContext = Location & { source: string[], error: Error }
export type FileCache = { [k: string]: Promise<string[]> }

const findLocation = (e: Error): null | Location => {
  const stack: any = e.stack
  if (!stack) return null
  const top: string = stack.split('\n')[1]
  const m = /((?:\/[^\/]+)+\.\w+)\:(\d+)\:(\d+)/.exec(top)
  if (!m) return null
  return { column: Number(m[3]), line: Number(m[2]), file: m[1] }
}

const readSource = (path: string, cache: FileCache): FileCache => ({
  [path]: cache[path] || readFileP(path, 'utf-8').then(content => content.split('\n'))
})

export const getErrorContext = (e: Error, c: FileCache): [Promise<null | ErrorContext>, FileCache] => {
  const l = findLocation(e)
  if (!l) return [Promise.resolve(null), c]
  const cache = readSource(l.file, c)
  return [cache[l.file].then(source => ({ ...l, source, error: e })), cache]
}