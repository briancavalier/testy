import equal from 'fast-deep-equal'

export type Assertion =
  | { ok: true, message: string }
  | { ok: false, message: string, reason: AssertionFailed }

export const ok = (k: boolean, message?: string): Assertion =>
  assert(k, message || 'assert', ok)

export const eq = <A>(a0: A, a1: A, message?: string): Assertion =>
  assert(equal(a0, a1), message || `eq(${a0}, ${a1})`, eq)

export const assert = (ok: boolean, message: string, at: Function): Assertion =>
  ok ? ({ ok, message })
    : ({ ok, message, reason: new AssertionFailed(message, at) })

export class AssertionFailed extends Error {
  constructor (public readonly message: string, at?: Function) {
    super(message)
    this.name = 'AssertionFailed'
    if (Error.captureStackTrace) Error.captureStackTrace(this, at)
  }
}
