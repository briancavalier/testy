
export type Assertion =
  | { ok: true, message: string, at: Function }
  | { ok: false, message: string, at: Function, failure: AssertionFailed }

export const assertion = (ok: boolean, message: string, at: Function): Assertion =>
  ok ? ({ ok, message, at })
    : ({ ok, message, at, failure: new AssertionFailed(message, at) })

export class AssertionFailed extends Error {
  constructor(public readonly message: string, at?: Function) {
    super(message)
    this.name = 'AssertionFailed'
    if (Error.captureStackTrace) Error.captureStackTrace(this, at)
  }
}

export const assert = (ok: boolean, message?: string): Assertion =>
  assertion(ok, message || 'assert', assert)

export const eq = <A>(a0: A, a1: A, message?: string): Assertion =>
  assertion(a0 === a1, message || 'eq', eq)