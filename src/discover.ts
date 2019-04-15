import { TestDiscoveryEvent } from './event'
import { TestSpec } from './test'

export async function* discoverTests(files: AsyncIterable<string>): AsyncIterable<TestDiscoveryEvent> {
  for await (const file of files) {
    const path = [file]
    yield { type: 'file:enter', path }
    yield* parseNode(path, require(file).default)
    yield { type: 'file:leave', path }
  }
}

export function* parseNode(p: string[], node: TestSpec): Iterable<TestDiscoveryEvent> {
  const path = [...p, node.label]
  if (node.type === 'group') {
    yield { type: 'group:enter', path }
    yield* parseNodes(path, node.nodes)
    yield { type: 'group:leave', path }
  } else {
    yield { type: 'test', path, test: node.test }
  }
}

export function* parseNodes(p: string[], nodes: TestSpec[]): Iterable<TestDiscoveryEvent> {
  for (const n of nodes) yield* parseNode(p, n)
}
