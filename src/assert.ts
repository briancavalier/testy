import equal from 'fast-deep-equal'

import { Assertion } from './types'

export const eq = <A>(expected: A, actual: A, message: string = `eq(${expected}, ${actual})`): Assertion =>
  equal(expected, actual) ? { ok: true, message } : { ok: false, message, reason: trace(message, eq) }

const trace = (message: string, at: Function) => {
  const e = new Error(message)
  if (Error.captureStackTrace) Error.captureStackTrace(e, at)
  return e
}
