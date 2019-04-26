import { Assertion, describe, eq, it } from '../src'

const fail = (s: string) => {
  throw new Error(s)
}

export default describe('the thing',
  describe('nested',
    it('is nested', async function* () {
      yield eq(1, 1)
    }),
    it('//does not execute', async function* () {
      yield eq(1, 1)
      throw new Error()
    })
  ),
  it('runs', async function* () {
    yield Promise.resolve(eq(1, 1))
  }),
  it('fails with timeout', async function* () {
    yield new Promise<Assertion>(resolve => setTimeout(resolve, 210, eq(1, 1)))
  }),
  it('has no assertions', async function* (): AsyncIterable<any> { }),
  it('fails', async function* () {
    yield eq(1, 1)
    yield eq(1, 2)
    yield eq(1, 1)
  }),
  it('throws', async function* () {
    yield eq(1, 1)
    fail('oops')
  }),
  it('todo'),
  describe('todo group',
    it('needs to be done')
  )
)
