import { report } from './report'
import { TestEvaluationEvent } from '../event'
import { parseJsonStream } from '../json'
import { createInterface } from 'readline'

const input = createInterface({ input: process.stdin })

report(process.cwd(), process.stdout, parseJsonStream<TestEvaluationEvent>(input as any))
  .then(code => {
    process.exit(code)
  }).catch(e => {
    console.error(e)
    process.exit(1)
  })
