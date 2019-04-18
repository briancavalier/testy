import { TestDiscoveryEvent } from './event'
import { TestCase, TestSpec } from './test'

export async function* discoverTests(files: AsyncIterable<string>): AsyncIterable<TestDiscoveryEvent<TestCase>> {
  for await (const file of files) {
    const path = [file]
    yield { type: 'file:enter', path }
    yield * parseNode(path, require(file).default as TestSpec<TestCase>)
    yield { type: 'file:leave', path }
  }
}

export function* parseNode<T>(p: string[], node: TestSpec<T>): Iterable<TestDiscoveryEvent<T>> {
  const path = [...p, node.label]
  if (node.type === 'group') {
    yield { type: 'group:enter', path }
    yield* parseNodes(path, node.nodes)
    yield { type: 'group:leave', path }
  } else {
    yield { type: 'test', path, test: node.test }
  }
}

export function* parseNodes<T>(p: string[], nodes: TestSpec<T>[]): Iterable<TestDiscoveryEvent<T>> {
  for (const n of nodes) yield* parseNode(p, n)
}
