import { eq } from '../src/assert'
import { describe, it } from '../src/test'

export default describe('the thing', [
  describe('nested', [
    it('should be nested', async function* () {
      yield eq(1, 1)
    }),

  ]),
  it('runs', async function* () {
    yield eq(1, 1)
    yield eq(2, 2)
    yield eq(3, 3)
  })
])