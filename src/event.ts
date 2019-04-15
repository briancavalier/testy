import { Assertion } from './assert'
import { TestCase } from './test'

export type TestTreeEvent =
  | { type: 'group:enter', path: string[] }
  | { type: 'group:leave', path: string[] }
  | { type: 'file:enter', path: string[] }
  | { type: 'file:leave', path: string[] }

export type TestDiscoveryEvent =
  | TestTreeEvent
  | { type: 'test', path: string[], test: TestCase }

export type TestEvaluationEvent =
  | TestTreeEvent
  | { type: 'test:skip', path: string[] }
  | { type: 'test:start', path: string[] }
  | { type: 'test:pass', path: string[], assertions: number }
  | { type: 'test:fail', path: string[] }
  | { type: 'test:error', path: string[], error: Error }
  | { type: 'assert', path: string[], assertion: Assertion }