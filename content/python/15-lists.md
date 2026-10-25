---
id: lists
track: python
level: Beginner
module: Collections
title: Lists
minutes: 20
keywords: list, append, slice, sort, mutability
summary: A list is an ordered, mutable sequence. Methods change the list. Slices and concatenation build new lists.
---

A list holds items in order, allows duplicates, and can be changed.

```python
tasks = ["write", "run", "read"]
tasks.append("ship")
tasks.insert(0, "think")
last = tasks.pop()
print(tasks, last)
print(tasks[0], tasks[-1])
```

| Method | Effect |
| --- | --- |
| `append(x)` | Add one item at the end |
| `extend(iterable)` | Add each item from an iterable |
| `insert(i, x)` | Insert at an index |
| `pop()` / `pop(i)` | Remove and return |
| `remove(x)` | Remove the first equal item, or raise `ValueError` |
| `clear()` | Remove everything |
| `index(x)` | Find the first index, or raise `ValueError` |
| `count(x)` | How many equal items |
| `sort()` / `reverse()` | Reorder in place, return `None` |
| `copy()` | A new list, same items |

`sorted(tasks)` returns a new list and leaves the original. `tasks.sort()` returns `None` and changes `tasks`. Printing the result of `.sort()` is a classic surprise: you see `None`, and the list was sorted as a side effect.

## Slices and copies

```python
nums = [0, 1, 2, 3, 4]
print(nums[1:4])
print(nums[::2])
nums[1:3] = [9]
print(nums)
fresh = nums[:]
```

A slice reads a new list. Assigning to a slice replaces that span. `nums[:]` is a shallow copy, like `nums.copy()`. The inner objects are shared. For a list of lists, copy is not enough; use `copy.deepcopy`.

:::why
`[[]] * 3` builds a list of three references to one inner list. Appending to `grid[0]` also changes `grid[1]` and `grid[2]`. The safe grid is `[[] for _ in range(3)]`, because the comprehension runs the expression once per row and each `[]` is a new list.
:::

```python
bad = [[0] * 2] * 2
bad[0][0] = 1
print(bad)

good = [[0, 0] for _ in range(2)]
good[0][0] = 1
print(good)
```

## Lists and functions

```python
def add_one(values):
    values.append(1)

def replace(values):
    values = [1]

data = []
add_one(data)
replace(data)
print(data)
```

`add_one` mutates the object the caller passed, so `data` becomes `[1]`. `replace` rebinds a local name. The caller's `data` still refers to the original list.

:::watch
`tasks = tasks.append("x")` sets `tasks` to `None`, because `append` returns `None`. Call `append` on its own line.
:::

:::try
Start from `[3, 1, 2]`. Sort it without losing the list to `None`. Append `4`. Print the list and its length.
:::

:::solution
```python
nums = [3, 1, 2]
nums.sort()
nums.append(4)
print(nums, len(nums))
```
:::

:::quiz
What does [[]] * 3 share?
+ One inner list, referenced three times
- Three independent inner lists
- Nothing. The multiplication copies deeply
because: Repeating a list repeats the reference. Each [] in a comprehension is a new object.
:::
