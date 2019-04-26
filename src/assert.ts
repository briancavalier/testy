import equal from 'fast-deep-equal'

import { Assertion } from './types'

export const ok = (k: boolean, message?: string): Assertion =>
  assert(k, message || 'ok', ok)

export const eq = <A>(a0: A, a1: A, message?: string): Assertion =>
  assert(equal(a0, a1), message || `eq(${a0}, ${a1})`, eq)

export const assert = (ok: boolean, message: string, at: Function): Assertion =>
  ok ? { ok, message } : { ok, message, reason: trace(message, at) }

const trace = (message: string, at?: Function) => {
  const e = new Error(message)
  if (Error.captureStackTrace) Error.captureStackTrace(e, at)
  return e
}
