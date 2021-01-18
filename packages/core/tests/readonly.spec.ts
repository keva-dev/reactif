import { createState } from '../src/createState'
import { readonly } from '../src/readonly'

interface TestObject {
  count: number
}
const _state: TestObject = createState({ count: 0 })
const state = readonly(_state)

test('Create readonly state', () => {
  expect(state.count).toBe(0)
})

test('Modify readonly state', () => {
  try { state.count = state.count + 1 } catch(e) {}
  expect(state.count).toBe(0)
})
