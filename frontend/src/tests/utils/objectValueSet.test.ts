import { ObjectValueSet } from '@/infrastructure/shared/utils/objectValueSet'
import { describe, expect, test as baseTest } from 'vitest'

type TestObject = {
  id: string
  content: string
}

const test = baseTest.extend('store', () => {
  return new ObjectValueSet<TestObject, 'id'>([], 'id')
})

describe('ObjectValueSet', () => {
  test('object can be obtained after addition', ({ store }) => {
    const testObj: TestObject = {
      id: 'test',
      content: 'TestContent',
    }

    store.add(testObj)

    expect(store.get('test')).toBe(testObj)
  })
  test("'addMultiple' filtering objects with the same key", ({ store }) => {
    store.addMultiple([
      { id: 'test1', content: 'foo' },
      { id: 'test2', content: 'bar' },
      { id: 'test1', content: 'bazBar' },
      { id: 'test3', content: 'baz' },
    ])

    expect.soft(store.get('test1')?.content).toBe('foo')
    expect.soft(store.get('test2')?.content).toBe('bar')
    expect.soft(store.get('test3')?.content).toBe('baz')
  })
  test('new objects with the same key are ignored', ({ store }) => {
    store.add({ id: 'test', content: 'foo' })
    store.add({ id: 'test', content: 'bar' })

    expect(store.get('test')?.content).toBe('foo')
  })
  test('return undefined if object with specified key is not presented', ({ store }) => {
    expect(store.get('unknown_id')).toBe(undefined)
  })
  test("can't get object after it's removal", ({ store }) => {
    const obj = { id: 'test', content: 'foo' }
    store.add(obj)

    expect.soft(store.get('test')).toBe(obj)

    store.remove(obj)

    expect.soft(store.get('test')).toBe(undefined)
  })
  test("'update' is merging specified object with existing one", ({ store }) => {
    store.add({ id: 'test', content: 'foo' })

    store.update('test', {
      content: 'bar',
    })

    expect(store.get('test')?.content).toBe('bar')
  })

  test("'update' is creating new object with specified key and properties", ({ store }) => {
    const originalObj = { id: 'test', content: 'foo' }
    store.add(originalObj)

    store.update('test', {
      content: 'bar',
    })

    const newObj = store.get('test')

    expect.soft(newObj).toBeTruthy()
    expect.soft(newObj).not.toBe(originalObj)
  })
})
