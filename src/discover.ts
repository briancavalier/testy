import { TestContext, TestDiscoveryEvent, TestSpec } from './types'

const defaultContext: TestContext = { timeout: 200, shouldSkip: false }

export async function* discoverTests<T>(files: AsyncIterable<string>): AsyncIterable<TestDiscoveryEvent<TestContext, T>> {
  for await (const file of files) {
    const path = [file]
    yield { type: 'file:enter', path }
    yield* parseNodes(path, defaultContext, Object.values(require(file)) as TestSpec<TestContext, T | null>[])
    yield { type: 'file:leave', path }
  }
}

export function* parseNode<T>(p: string[], c: TestContext, node: TestSpec<TestContext, T | null>): Iterable<TestDiscoveryEvent<TestContext, T>> {
  const path = [...p, node.label]
  const context = { ...c, ...node.context }
  if (node.type === 'group') {
    yield { type: 'group:enter', path }
    yield* parseNodes(path, context, node.nodes)
    yield { type: 'group:leave', path }
  } else if (node.type === 'test') {
    yield (node.test
      ? { type: 'test', path, context, test: node.test }
      : { type: 'todo', path })
  }
}

export function* parseNodes<T>(p: string[], context: TestContext, nodes: TestSpec<TestContext, T | null>[]): Iterable<TestDiscoveryEvent<TestContext, T>> {
  for (const node of nodes) yield* parseNode(p, context, node)
}
