import { TestDiscoveryEvent } from './event'
import { TestSpec } from './test'

export async function* discoverTests<T>(files: AsyncIterable<string>): AsyncIterable<TestDiscoveryEvent<T>> {
  for await (const file of files) {
    const path = [file]
    yield { type: 'file:enter', path }
    yield * parseNode(path, require(file).default as TestSpec<T | null>)
    yield { type: 'file:leave', path }
  }
}

export function* parseNode<T>(p: string[], node: TestSpec<T | null>): Iterable<TestDiscoveryEvent<T>> {
  const path = [...p, node.label]
  if (node.type === 'group') {
    yield { type: 'group:enter', path }
    yield* parseNodes(path, node.nodes)
    yield { type: 'group:leave', path }
  } else if (node.type === 'test') {
    yield (node.test
      ? { type: 'test', path, test: node.test }
      : { type: 'todo', path })
  }
}

export function* parseNodes<T>(p: string[], nodes: TestSpec<T | null>[]): Iterable<TestDiscoveryEvent<T>> {
  for (const n of nodes) yield* parseNode(p, n)
}
