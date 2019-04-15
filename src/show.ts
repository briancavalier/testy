import { Assertion } from './assert'
import { ErrorContext } from './context'
import chalk from 'chalk'

export const PATH_SEP = chalk.gray.dim(' › ')

export const showPath = (path: string[]): string => {
  const name = [path[0], ...path.slice(1, path.length - 1).map(s => chalk.gray.dim(s)), chalk.whiteBright(path[path.length - 1])]
  return `${name.join(PATH_SEP)}`
}

export const showAssertion = (path: string[], a: Assertion): string =>
  `${showPath(path)}${PATH_SEP}${(a.ok ? a.message : chalk.red(a.message))}`

export const showError = (path: string[], e: Error): string =>
  `${showPath(path)}${PATH_SEP}${chalk.red.bold(String(e))}`

export const showSkip = (path: string[]): string =>
  `${showPath(path)} ${chalk.yellow('(Skipped)')}`

export const showErrorContext = (before: number, after: number, c: ErrorContext): string => {
  const li = c.line - 1
  const start = Math.max(0, li - before)
  const end = Math.min(li + after + 1, c.source.length)
  const p = String(end).length + 1
  return c.source.slice(start, li).map((l, i) => chalk.gray.dim(`${pad(p, String(start + i + 1))} ${l}`)).join('\n') +
    `\n${chalk.gray.dim(pad(p, String(c.line)))} ${chalk.bold(c.source[li])}\n` +
    c.source.slice(li + 1, end).map((l, i) => chalk.gray.dim(`${pad(p, String(c.line + 1 + i))} ${l}`)).join('\n')
}

const pad = (max: number, s: string): string =>
  max > s.length ? `${Array(1 + max - s.length).join(' ')}${s}` : s