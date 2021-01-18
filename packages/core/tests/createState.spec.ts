import { createState } from '../src/createState'

interface TestObject {
  count: number
}
const state: TestObject = createState({ count: 0 })

test('Create reactive state', () => {
  expect(state.count).toBe(0)
})

test('Modify reactive state', () => {
  state.count = state.count + 1
  expect(state.count).toBe(1)
})
