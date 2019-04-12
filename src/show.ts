import { Assertion } from './assert'
import chalk from 'chalk'
import { Writable } from 'stream'

export const PATH_SEP = chalk.gray.dim(' › ')

export const showPath = (path: string[]): string => {
  const name = [...path.slice(0, path.length - 1), chalk.whiteBright(path[path.length - 1])]
  return `${name.join(PATH_SEP)}`
}

export const showAssertion = (path: string[], a: Assertion): string =>
  `${showPath(path)}${PATH_SEP}${(a.ok ? chalk.greenBright : chalk.redBright)(a.message)}`

export const showError = (path: string[], e: Error): string =>
  `${showPath(path)}${PATH_SEP}${chalk.red(String(e))}`
