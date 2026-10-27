---
id: tasks-patterns
track: practice
level: Advanced
module: Tasks
title: Tasks — patterns
minutes: 35
keywords: task, binary search, stack, window, flatten
summary: Binary search, a stack, a sliding window, and flattening. Match the sentence to the pattern before you type.
---

Do the logic lessons on patterns first if these names are new. Each solution below is the pattern, not a puzzle with a hidden twist.

## Task 1 — binary search

`items` is sorted ascending. Return the index of `target`, or `None`. Do not call `list.index`.

:::solution
```python
def binary_search(items, target):
    low = 0
    high = len(items) - 1
    while low <= high:
        mid = (low + high) // 2
        if items[mid] == target:
            return mid
        if items[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return None

print(binary_search([1, 3, 4, 7, 9], 7))
print(binary_search([1, 3, 4, 7, 9], 2))
```

`low <= high` is what lets a one-item list succeed. `<` would skip that last remaining index.
:::

## Task 2 — balanced brackets

Accept `()[]{}` and ignore nothing else: other characters return `False`. `""` is balanced.

:::solution
```python
def balanced(text):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in text:
        if ch in "([{":
            stack.append(ch)
        elif ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
        else:
            return False
    return not stack

print(balanced("([])"), balanced("([)]"), balanced(""), balanced("(a)"))
```
:::

## Task 3 — best sum of k neighbors

Raise `ValueError` when `k` does not fit.

:::solution
```python
def max_window(nums, k):
    if k <= 0 or k > len(nums):
        raise ValueError("k must fit the list")
    window = sum(nums[:k])
    best = window
    for i in range(k, len(nums)):
        window += nums[i] - nums[i - k]
        if window > best:
            best = window
    return best

print(max_window([2, 1, 5, 1, 3], 2))
```
:::

## Task 4 — flatten one level

`[[1, 2], [], [3]]` becomes `[1, 2, 3]`. Do not flatten deeper than one level: `[[1, [2]]]` becomes `[1, [2]]`.

:::solution
```python
def flatten_one(rows):
    result = []
    for row in rows:
        for item in row:
            result.append(item)
    return result

print(flatten_one([[1, 2], [], [3]]))
print(flatten_one([[1, [2]]]))
```
:::

## Task 5 — running totals

`[3, 1, 4]` becomes `[3, 4, 8]`.

:::solution
```python
def prefix_sums(nums):
    result = []
    total = 0
    for num in nums:
        total += num
        result.append(total)
    return result

print(prefix_sums([3, 1, 4]))
```
:::
