import { Assertion } from '../assert'
import { ErrorContext } from '../context'
import chalk from 'chalk'

type Color = (s: string) => string

export const PATH_SEP = chalk.gray.dim(' › ')
export const SUMMARY_SEP = chalk.gray.dim(', ')

export const showPath = (path: string[]): string => {
  const name = [path[0], ...path.slice(1, path.length - 1).map(s => chalk.gray.dim(s)), chalk.whiteBright(path[path.length - 1])]
  return `${name.join(PATH_SEP)}`
}

const showSummaryItem = (n: number, s: string, c: Color): string =>
  n > 0 ? c(`${n} ${s}`) : ''

export const showSummary = (time: number, pass: number, fail: number, skip: number, crash: number): string => {
  const s = [
    showSummaryItem(pass, 'passed', chalk.greenBright),
    showSummaryItem(fail, 'failed', chalk.redBright),
    showSummaryItem(crash, 'crashed', chalk.red.bold),
    showSummaryItem(skip, 'skipped', chalk.yellowBright)
  ].filter(s => s.length > 0)

  return `${s.join(SUMMARY_SEP)} ${chalk.gray.dim(`(${time}ms)`)}`
}

export const showStats = (time: number, files: number, tests: number, assert: number): string =>
  chalk.dim.gray(`${assert} assertions (${Math.floor(assert / tests)}/test, ${Math.floor(assert / files)}/file, ${(1000 * assert / time).toFixed(1)}/sec)` +
    `, ${tests} tests (${Math.floor(tests / files)}/file, ${(1000 * tests / time).toFixed(1)}/sec)` +
    `, ${files} files (${(1000 * files / time).toFixed(1)}/sec)`)

export const showAssertion = (path: string[], a: Assertion): string =>
  `${chalk.red.bold('Fail')} ${showPath(path)}${PATH_SEP}${(a.ok ? a.message : chalk.red(a.message))}`

export const showError = (path: string[], e: Error): string =>
  `${chalk.red.bold('Fail')} ${showPath(path)}${PATH_SEP}${chalk.red(e.message)}`

export const showStack = (e: Error): string =>
  chalk.dim.gray(e.stack || e.message)

export const showSkip = (path: string[]): string =>
  `${chalk.yellow.bold('Skip')} ${showPath(path)}`

export const showFileLink = (c: ErrorContext): string =>
  chalk.underline(`${c.file}:${c.line}:${c.column}`)

export const showErrorContext = (before: number, after: number, c: ErrorContext): string => {
  const li = c.line - 1
  const start = Math.max(0, li - before)
  const end = Math.min(li + after + 1, c.source.length)
  const b = trimArrayLeft(c.source.slice(start, li))
  const a = trimArrayRight(c.source.slice(li + 1, end))

  const numberColWidth = String(c.line + a.length).length + 1
  const s = li - b.length;

  return b.map((l, i) => chalk.gray.dim(`${pad(numberColWidth, String(s + i + 1))} ${l}`)).join('\n') +
    `\n${chalk.gray.dim(pad(numberColWidth, String(c.line)))} ${chalk.bold(c.source[li])}\n` +
    a.map((l, i) => chalk.gray.dim(`${pad(numberColWidth, String(c.line + i + 1))} ${l}`)).join('\n')
}

const trimArrayLeft = (a: string[]): string[] => {
  for (let i = 0; i < a.length; i += 1) {
    if (a[i].trim().length > 0) return a.slice(i)
  }
  return a
}

const trimArrayRight = (a: string[]): string[] => {
  for (let i = a.length - 1; i >= 0; i -= 1) {
    if (a[i].trim().length > 0) return a.slice(0, i + 1)
  }
  return a
}

const pad = (max: number, s: string): string =>
  max > s.length ? `${Array(1 + max - s.length).join(' ')}${s}` : s
