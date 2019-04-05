import { describe } from './bdd'
import { TestPlan } from './test'
import { relative } from 'path'
import glob from 'tiny-glob'

const GLOB_OPTIONS = { absolute: true, filesOnly: true }

export const findTests = <A> (globs: string[]): Promise<TestPlan<A>[]> => {
  const cwd = process.cwd()
  return globs.map(async g => {
    const fs = await glob(g, GLOB_OPTIONS)
    return fs.map(f => describe(relative(cwd, f), require(f).default)) as TestPlan<A>[]
  }).reduce(async (all, some) => (await all).concat(await some))
}
