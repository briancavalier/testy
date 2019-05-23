import { describe, eq, it } from '../src'

const crash = (s: string) => {
  throw new Error(s)
}

const given = describe

export const t1 = describe('the thing',
  given('whatever',
    it('does the stuff', async function* () {
      yield eq(1, 1)
    }),
    it(`doesn't do the other stuff`, async function* () {
      yield eq(1, 2)
    })
  )
)

export const test0 = it('passing test', async function* () {
  yield eq(1, 1, 'passes')
})

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
