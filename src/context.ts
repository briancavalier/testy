import { readFile } from 'fs'
import { promisify } from 'util'

const readFileP = promisify(readFile)

const LOCALTION_RX = /((?:\/[^\/]+)+\.\w+)\:(\d+)\:(\d+)/

export type Location = { column: number, line: number, file: string }
export type ErrorContext = Location & { source: string[] }
export type FileCache = { [k: string]: Promise<string[]> }

export const findErrorLocation = (e: Error): null | Location => {
  const stack = e.stack

  if (!stack) return null

  const top: string = stack.split('\n')[1]
  const m = LOCALTION_RX.exec(top)

  if (!m) return null

  return { column: Number(m[3]), line: Number(m[2]), file: m[1] }
}

export const getErrorContext = (l: Location, c: FileCache): [Promise<ErrorContext>, FileCache] => {
  const source = c[l.file] || readFileP(l.file, 'utf-8').then(content => content.split('\n'))
  return [source.then(source => ({ ...l, source })), { [l.file]: source }]
}
