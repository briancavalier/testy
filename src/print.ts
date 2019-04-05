import { TestResults, TestResultSummary } from './collect'
import { Accumulate, Test, TestResult } from './test'
import chalk from 'chalk'
import { hide, show } from 'cli-cursor'
import { relative } from 'path'
import { Writable } from 'stream'
const readline = require('readline')

const PATH_SEP = chalk.gray.dim(' › ')

const pad = (max: number, s: string): string =>
  max > s.length ? `${Array(1 + max - s.length).join(' ')}${s}` : s

const format = (c: any, n: number, s: string): string =>
  n === 0 ? '' : c.bold((pad(4, `${n}`) + ` ${s}`))

export const print = <A>(w: Writable, a: Accumulate<TestResult<Test<A>>, TestResults<TestResult<Test<A>>>, TestResultSummary<TestResult<Test<A>>>>): Accumulate<TestResult<Test<A>>, TestResults<TestResult<Test<A>>>, TestResultSummary<TestResult<Test<A>>>> => ({
  init: () => {
    hide()
    return a.init()
  },
  tally: (t, r) => {
    const t1 = a.tally(t, r)
    readline.clearLine(w, 0)
    readline.cursorTo(w, 0)
    w.write(`${format(chalk.greenBright, t1.pass.length, 'passed')} ${format(chalk.redBright, t1.fail.length, 'failed')} ${format(chalk.yellowBright, t1.skip.length, 'skipped')} ${format(chalk.cyanBright, t1.todo.length, 'todo')}`)
    const name = [r.test.path[0], ...r.test.path.slice(1).map(s => chalk.whiteBright.bold(s))]
    w.write(` ${name.join(PATH_SEP)}`)
    return t1
  },
  summarize: t => {
    const s = a.summarize(t)
    readline.clearLine(w, 0)
    readline.cursorTo(w, 0)
    w.write(`${format(chalk.greenBright, s.pass, 'passed')} ${format(chalk.redBright, s.fail.length, 'failed')} ${format(chalk.yellowBright, s.skip, 'skipped')} ${format(chalk.cyanBright, s.todo, 'todo')}`)
    show()
    return s
  }
})