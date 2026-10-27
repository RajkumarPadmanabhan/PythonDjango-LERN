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

:::how
`low` and `high` are the ends of the slice still worth searching. `mid` is the middle index. If that value is the target, its index is the answer. If the middle is smaller than the target, everything at `mid` and to the left is too small, so `low` becomes `mid + 1`. If the middle is larger, `high` becomes `mid - 1`. The loop stops when the slice is empty (`low > high`), which means the target is absent. `low <= high` is required so a last remaining index is still checked. This only works because the list is sorted: the comparison tells you which half to throw away.
:::

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

:::how
`pairs` maps each closer to the opener it must match. An opener is pushed, so the end of `stack` is the most recent unmatched opener. A closer pops that opener and compares. `([)]` fails because `[` is on top and the next closer is `)`. An empty stack on a closer means there is nothing to close. A non-bracket character returns `False` immediately because this task accepts only brackets. At the end, `not stack` is true only when every opener was closed. `""` never loops, the stack stays empty, and that is balanced.
:::
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

:::how
The first window is the sum of the first `k` items. Each later step reuses that sum: add the item that entered (`nums[i]`) and subtract the item that fell out (`nums[i - k]`). For `k` of 2, the windows are `2+1`, then `1+5`, then `5+1`, then `1+3`. `best` remembers the largest of those sums. Rebuilding the sum from scratch each time would be correct and slower. The guard rejects a `k` that cannot be a window of this list.
:::
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

:::how
The outer loop walks rows. The inner loop walks items in that row and appends each one. An empty row adds nothing. The inner loop does not look inside an item, so `[2]` is one item and stays a list. That is one level. A third loop, or a recursive call, would be a deeper flatten, which this task does not ask for.
:::
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

:::how
`total` is the sum of everything seen so far. After each addition, that total is appended, so the result list is a snapshot of the memory at every step: 3, then 3+1, then 4+4. The input list is not changed. An empty input never enters the loop and returns `[]`.
:::
:::
