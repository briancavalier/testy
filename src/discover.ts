import { TestContext, TestDiscoveryEvent, TestSpec } from './types'

export async function* discoverTests<C, T>(defaultContext: C, files: AsyncIterable<string>): AsyncIterable<TestDiscoveryEvent<C, T>> {
  for await (const file of files) {
    const path = [file]
    yield { type: 'file:enter', path }
    yield* parseNodes(path, defaultContext, Object.values(require(file)) as TestSpec<Partial<C>, T>[])
    yield { type: 'file:leave', path }
  }
}

export function* parseNode<C, T>(p: string[], c: C, node: TestSpec<Partial<C>, T>): Iterable<TestDiscoveryEvent<C, T>> {
  const path = [...p, node.label]
  if (node.type === 'group') {
    yield { type: 'group:enter', path }
    yield* parseNodes(path, { ...c, ...node.context }, node.nodes)
    yield { type: 'group:leave', path }
  } else if (node.type === 'test') {
    yield { type: 'test', path, context: { ...c, ...node.context }, test: node.test }
  } else if (node.type === 'todo') {
    yield { type: 'todo', path }
  }
}

export function* parseNodes<C, T>(p: string[], context: C, nodes: TestSpec<Partial<C>, T>[]): Iterable<TestDiscoveryEvent<C, T>> {
  for (const node of nodes) yield* parseNode(p, context, node)
}
