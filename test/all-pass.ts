import { Assertion, describe, eq, it } from '../src'

type Test = AsyncIterable<Assertion>

export default describe('the thing',
  describe('nested 1',
    it('passes 1', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 2', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 3', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 4', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 5', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 6', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 7', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 8', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 9', async function* (): Test {
      yield eq(1, 1)
    })
  ),
  describe('nested 2',
    it('passes 1', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 2', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 3', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 4', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 5', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 6', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 7', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 8', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 9', async function* (): Test {
      yield eq(1, 1)
    })
  ),
  describe('nested 3',
    it('passes 1', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 2', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 3', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 4', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 5', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 6', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 7', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 8', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 9', async function* (): Test {
      yield eq(1, 1)
    })
  ),
  describe('nested 4',
    it('passes 1', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 2', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 3', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 4', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 5', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 6', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 7', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 8', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 9', async function* (): Test {
      yield eq(1, 1)
    })
  ),
  describe('nested 5',
    it('passes 1', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 2', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 3', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 4', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 5', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 6', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 7', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 8', async function* (): Test {
      yield eq(1, 1)
    }),
    it('passes 9', async function* (): Test {
      yield eq(1, 1)
    })
  ),
)
