import equal from 'fast-deep-equal'

import { Assertion } from './types'

export const eq = <A>(expected: A, actual: A, message?: string): Assertion =>
  equal(expected, actual)
    ? { ok: true, message: message || `eq(${expected}, ${actual})` }
    : { ok: false, message: message || `eq(${expected}, ${actual})`, reason: trace(eq) }

const trace = (at: Function) => {
  const e = new Error()
  if (Error.captureStackTrace) Error.captureStackTrace(e, at)
  return e
}
