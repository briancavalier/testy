import { Assertion } from './assert'
import chalk from 'chalk'

export const PATH_SEP = chalk.gray.dim(' › ')

export const showPath = (path: string[]): string => {
  const name = [...path.slice(0, path.length - 1).map(s => chalk.gray.dim(s)), chalk.whiteBright(path[path.length - 1])]
  return `${name.join(PATH_SEP)}`
}

export const showAssertion = (path: string[], a: Assertion): string =>
  `${showPath(path)}${PATH_SEP}${(a.ok ? a.message : chalk.red(a.message))}`

export const showError = (path: string[], e: Error): string =>
  `${showPath(path)}${PATH_SEP}${chalk.red.bold(String(e))}`
