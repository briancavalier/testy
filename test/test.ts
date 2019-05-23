import { eq, it } from '../src'

const fail = (s: string) => {
  throw new Error(s)
}

export const test1 = it('the thing', async function* () {
  yield eq(1, 1, 'runs')
  yield eq(1, 2, `fails`)
})

export const test2 = it('todo')

export const test3 = it('//skipped', async function* () {
  yield eq(0, 1, 'should have been skipped')
})

export const test4 = it('crashes', async function* () {
  fail('oops')
})
//   describe('nested',
//   it('is nested', async function* () {
//     yield eq(1, 1)
//   }),
//   it('//does not execute', async function* () {
//     yield eq(1, 1)
//     throw new Error()
//   })
// ),
//   it('runs', async function* () {
//     yield Promise.resolve(eq(1, 1))
//   }),
//   it('fails with timeout', async function* () {
//     yield new Promise<Assertion>(resolve => setTimeout(resolve, 210, eq(1, 1)))
//   }),
//   it('has no assertions', async function* (): AsyncIterable<any> { }),
//   it('fails', async function* () {
//     yield eq(1, 1)
//     yield eq(1, 2)
//     yield eq(1, 1)
//   }),
//   it('throws', async function* () {
//     yield eq(1, 1)
//     fail('oops')
//   }),
//   it('todo'),
//   describe('todo group',
//     it('needs to be done')
//   )
// )
