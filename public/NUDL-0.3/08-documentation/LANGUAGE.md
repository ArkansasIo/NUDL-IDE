# NUDL Language Overview

## Core concepts

NUDL 0.3 organizes programs around declarations, typed values, records, datasets, functions, validation rules, and explicit transformations.

### Example

```nudl
schema User {
  id: u64 required
  name: text
  active: bool = true
}

data users: User {
  { id: 1, name: "Alice", active: true }
  { id: 2, name: "Bob", active: false }
}

fn active_users(input: User[]) -> User[] {
  return input where item.active == true
}
```

The example is a proposed NUDL syntax template, not evidence that a compiler already accepts every construct.
