import { createInterface } from 'readline'

import { parseJsonStream } from '../run/json'
import { Assertion, TestContext, TestEvaluationEvent } from '../types'
import { report } from './report'

const input = createInterface({ input: process.stdin })

report(process.cwd(), process.stdout, parseJsonStream<TestEvaluationEvent<TestContext, Assertion>>(input as any))
  .then(code => {
    process.exit(code)
  }).catch(e => {
    console.error(e)
    process.exit(1)
  })
