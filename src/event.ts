import { Assertion } from './assert'

export type TestTreeEvent =
  | { type: 'group:enter', path: string[] }
  | { type: 'group:leave', path: string[] }
  | { type: 'file:enter', path: string[] }
  | { type: 'file:leave', path: string[] }
  | { type: 'todo', path: string[] }

export type TestDiscoveryEvent<T> =
  | TestTreeEvent
  | { type: 'test', path: string[], test: T }

export type TestEvaluationEvent =
  | TestTreeEvent
  | { type: 'test:skip', path: string[] }
  | { type: 'test:start', path: string[] }
  | { type: 'test:pass', path: string[], assertions: number }
  | { type: 'test:fail', path: string[], reason: Error }
  | { type: 'test:error', path: string[], error: Error }
  | { type: 'assert', path: string[], assertion: Assertion }
