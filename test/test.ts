import { describe, eq, it } from '../src'

const crash = (s: string) => {
  throw new Error(s)
}

export default describe('the thing',
  it('does the stuff', async function* () {
    yield eq(1, 1)
  }),
  it('fails', async function* () {
    const x = 1
    const y = 2
    yield eq(x, y)
  }),
  it('passing test', async function* () {
    yield eq(1, 1, 'passes')
  })
)

export const test1 = it('the thing', async function* () {
  yield eq(1, 1, 'runs')
  yield eq(1, 2, `fails`)
})

export const test2 = it('todo')

export const test3 = it('//skipped', async function* () {
  yield eq(0, 1, 'should have been skipped')
})

export const test4 = it('crashes', async function* () {
  crash('oops')
})
