import { describe, it, todo } from '..'
import assert from 'assert'

export default [
  it('hi', () => { }),
  it('2', () => {
    assert(true)
  }),
  describe('async', [
    it('1', () => Promise.resolve()),
    it('2', async () => {})
  ]),
  todo('todo this')
]
