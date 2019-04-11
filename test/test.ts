import { eq } from '../src/assert'
import { describe, it, test } from '../src/test'

export default test([
  describe('nested', [
    it('should be nested', async function* () {
      yield eq(1, 1)
    })
  ]),
  it('runs', async function* () {
    yield eq(1, 1)
    // yield eq(1, 2)
  }),
  it('fails', async function* () {
    yield eq(1, 1)
    yield eq(1, 2)
    yield eq(1, 1)
  }),
  it('throws', async function* () {
    yield eq(1, 1)
    throw new Error('oops')
  })
])