import { eq, it, test } from '../src'

export default test('the thing',
  test('nested',
    it('is nested', async function* () {
      yield eq(1, 1)
    }),
    it('fails nested', async function* () {
      const x = 1
      yield eq(1, 2)
    })
  ),
  it('runs', async function* () {
    yield eq(1, 1)
    yield eq(2, 2)
    yield eq(3, 3)
  })
)
