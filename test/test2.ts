import { describe, it } from '..'

const delay = (): Promise<void> => new Promise(resolve => setTimeout(resolve, 1000))

export default [
  it('hi', () => { }),
  it('2', () => {
    throw new Error('oops')
  }),
  describe('test 2 async', [
    it('1', () => delay()),
    it('2', () => Promise.reject(new Error('async oops')))
  ]),
  describe('test 2 async', [
    describe('test 3 async', [
      it('1', () => delay()),
      it('2', () => Promise.reject(new Error('async oops')))
    ]),
    it('1', () => delay()),
    it('2', () => Promise.reject(new Error('async oops')))
  ]),
  describe('test 2 async', [
    describe('test 3 async', [
      it('1', () => delay()),
      it('2', () => Promise.reject(new Error('async oops')))
    ]),
    it('1', () => delay()),
    it('2', () => Promise.reject(new Error('async oops')))
  ]),
  it('2', () => {
    throw new Error('oops')
  }),
  describe('test 2 async', [
    it('1', () => delay()),
    it('2', () => Promise.reject(new Error('async oops')))
  ]),
  describe('test 2 async', [
    describe('test 3 async', [
      it('1', () => delay()),
      it('2', () => Promise.reject(new Error('async oops')))
    ]),
    it('1', () => delay()),
    it('2', () => Promise.reject(new Error('async oops')))
  ]),
  describe('test 2 async', [
    describe('test 3 async', [
      it('1', () => delay()),
      it('2', () => Promise.reject(new Error('async oops')))
    ]),
    it('1', () => delay()),
    it('2', () => Promise.reject(new Error('async oops')))
  ]),
    it('2', () => {
    throw new Error('oops')
  }),
  describe('test 2 async', [
    it('1', () => delay()),
    it('2', () => Promise.reject(new Error('async oops')))
  ]),
  describe('test 2 async', [
    describe('test 3 async', [
      it('1', () => delay()),
      it('//2', () => Promise.reject(new Error('async oops')))
    ]),
    it('1', () => delay()),
    it('2', () => Promise.reject(new Error('async oops')))
  ]),
  describe('test 2 async', [
    describe('test 3 async', [
      it('1', () => delay()),
      it('2', () => Promise.reject(new Error('async oops')))
    ]),
    it('1', () => delay()),
    it('2', () => Promise.reject(new Error('async oops')))
  ]),
    it('2', () => {
    throw new Error('oops')
  }),
  describe('test 2 async', [
    it('1', () => delay()),
    it('2', () => Promise.reject(new Error('async oops')))
  ]),
  describe('test 2 async', [
    describe('test 3 async', [
      it('1', () => delay()),
      it('2', () => Promise.reject(new Error('async oops')))
    ]),
    it('1', () => delay()),
    it('2', () => Promise.reject(new Error('async oops')))
  ]),
  describe('test 2 async', [
    describe('test 3 async', [
      it('1', () => delay()),
      it('2', () => Promise.reject(new Error('async oops')))
    ]),
    it('1', () => delay()),
    it('2', () => Promise.reject(new Error('async oops')))
  ]),
  it('2', () => {
    throw new Error('oops')
  }),
  describe('test 2 async', [
    it('1', () => delay()),
    it('2', () => Promise.reject(new Error('async oops')))
  ]),
  describe('test 2 async', [
    describe('test 3 async', [
      it('1', () => delay()),
      it('2', () => Promise.reject(new Error('async oops')))
    ]),
    it('1', () => delay()),
    it('2', () => Promise.reject(new Error('async oops')))
  ]),
  describe('test 2 async', [
    describe('test 3 async', [
      it('1', () => delay()),
      it('2', () => Promise.reject(new Error('async oops')))
    ]),
    it('1', () => delay()),
    it('2', () => Promise.reject(new Error('async oops')))
  ]),
  it('2', () => {
    throw new Error('oops')
  }),
  describe('test 2 async', [
    it('1', () => delay()),
    it('2', () => Promise.reject(new Error('async oops')))
  ]),
  describe('test 2 async', [
    describe('test 3 async', [
      it('1', () => delay()),
      it('2', () => Promise.reject(new Error('async oops')))
    ]),
    it('1', () => delay()),
    it('2', () => Promise.reject(new Error('async oops')))
  ]),
  describe('test 2 async', [
    describe('test 3 async', [
      it('1', () => delay()),
      it('2', () => Promise.reject(new Error('async oops')))
    ]),
    it('1', () => delay()),
    it('2', () => Promise.reject(new Error('async oops')))
  ]),
  it('2', () => {
    throw new Error('oops')
  }),
  describe('//test 2 async', [
    it('1', () => delay()),
    it('2', () => Promise.reject(new Error('async oops')))
  ]),
  describe('test 2 async', [
    describe('test 3 async', [
      it('1', () => delay()),
      it('2', () => Promise.reject(new Error('async oops')))
    ]),
    it('1', () => delay()),
    it('2', () => Promise.reject(new Error('async oops')))
  ]),
  describe('test 2 async', [
    describe('test 3 async', [
      it('1', () => delay()),
      it('2', () => Promise.reject(new Error('async oops')))
    ]),
    it('1', () => delay()),
    it('2', () => Promise.reject(new Error('async oops')))
  ]),
]
