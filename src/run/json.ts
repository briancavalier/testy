import { TestEvaluationEvent } from '../types'

type ErrorJson = {
  name: string | undefined,
  message: string,
  stack: string | undefined
}

export async function* toJson<C, A>(events: AsyncIterable<TestEvaluationEvent<C, A>>): AsyncIterable<string> {
  for await (const event of events) yield JSON.stringify(event, serializeErrors)
}

const serializeErrors = <A>(key: string, value: A): A | ErrorJson =>
  value instanceof Error ? ({ name: value.name, message: value.message, stack: value.stack }) : value

export async function* parseJsonStream<A>(input: AsyncIterable<string>): AsyncIterable<A> {
  for await (const b of input) yield JSON.parse(b.trim())
}
