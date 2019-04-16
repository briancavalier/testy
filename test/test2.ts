import { assert, describe, eq, it } from '../src'

export default describe('the thing',
  describe('nested',
    it('is nested', async function * () {
      yield assert(1 === 1)
    }),
    it('fails nested', async function * () {
      const x = 1
      yield assert(x >= 2)
    })
  ),
  it('runs', async function * () {
    yield eq(1, 1)
    yield eq(2, 2)
    yield eq(3, 3)
  })
)
