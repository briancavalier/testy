import { assert, describe, eq, it } from '../src'

export default describe('the thing',
  describe('nested',
    it('should be nested', async function * () {
      yield assert(1 === 1)
    }),
    it('should fail nested', async function * () {
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
