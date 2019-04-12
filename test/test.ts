import { eq } from '../src/assert'
import { describe, it } from '../src/test'

export default describe('the thing', [
  describe('nested', [
    it('should be nested', async function* () {
      yield eq(1, 1)
    }),
    it('//should not execute', async function* () {
      yield eq(1, 1)
      throw new Error()
    })
  ]),
  it('runs', async function* () {
    yield eq(1, 1)
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