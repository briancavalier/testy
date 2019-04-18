import { TestEvaluationEvent } from './event'
import { Writable } from 'stream'

type ErrorJson = {
  name: string | undefined,
  message: string,
  stack: string | undefined
}

export async function writeJson(out: Writable, events: AsyncIterable<TestEvaluationEvent>): Promise<number> {
  for await (const event of events) {
    out.write(`${JSON.stringify(event, serializeErrors)}\n`)
  }

  return 0
}

const serializeErrors = <A>(key: string, value: A): A | ErrorJson =>
  value instanceof Error ? ({ name: value.name, message: value.message, stack: value.stack }) : value

export async function* parseJsonStream<A>(input: AsyncIterable<string>): AsyncIterable<A> {
  for await (const b of input) yield JSON.parse(b.trim())
}