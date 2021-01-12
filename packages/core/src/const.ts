export const NODE_TYPE_CONST = {
  ELEMENT_NODE: 1,
  ATTRIBUTE_NODE: 2,
  TEXT_NODE: 3,
  COMMENT_NODE: 8
}

// Attributes that might be changed dynamically
// Examples: <input value="something"/> <button hidden></button>
export const DYNAMIC_ATTRIBUTES = ['checked', 'selected', 'value', 'hidden']