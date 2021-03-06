import { createInterface } from 'readline'

import { fromJson } from '../json'
import { Assertion, TestContext, TestEvaluationEvent } from '../types'
import { report } from './report'

const input = createInterface({ input: process.stdin })

report(process.cwd(), process.stdout, fromJson<TestEvaluationEvent<TestContext, Assertion>>(input as any))
  .then(code => {
    process.exit(code)
  }).catch(e => {
    console.error(e)
    process.exit(1)
  })
