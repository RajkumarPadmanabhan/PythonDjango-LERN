---
id: logic-patterns
track: practice
level: Advanced
module: Logic building
title: Patterns you will meet again
minutes: 20
keywords: frequency, two pointers, sliding window, stack
summary: Frequency maps, two indexes on sorted data, a sliding window, and a stack. Learn the shape, then match it to the sentence.
---

These are not tricks to memorize as magic. Each one is a loop job you already know, with a specific kind of memory.

## Frequency map

"Which value appears most?" is a dict of counts, then a scan of that dict.

```python
def most_common(items):
    tally = {}
    for item in items:
        tally[item] = tally.get(item, 0) + 1
    best_item = None
    best_count = -1
    for item, count in tally.items():
        if count > best_count:
            best_item = item
            best_count = count
    return best_item

print(most_common(["a", "b", "a", "c", "a", "b"]))
```

Ties keep the first winner, because `>` does not replace an equal count.

## Two indexes, only if the data is sorted

```python
def pair_sorted(nums, target):
    left = 0
    right = len(nums) - 1
    while left < right:
        total = nums[left] + nums[right]
        if total == target:
            return nums[left], nums[right]
        if total < target:
            left += 1
        else:
            right -= 1
    return None

print(pair_sorted([1, 2, 4, 7, 11], 13))
```

Moving `left` up increases the sum. Moving `right` down decreases it. That story is false if the list is not sorted.

## Sliding window

"Best sum of any `k` neighbors" reuses the previous sum. Drop the item that fell out of the window, add the item that entered.

```python
def max_window(nums, k):
    if k <= 0 or k > len(nums):
        raise ValueError("k must be between 1 and the length")
    window = sum(nums[:k])
    best = window
    for i in range(k, len(nums)):
        window += nums[i] - nums[i - k]
        if window > best:
            best = window
    return best

print(max_window([2, 1, 5, 1, 3], 2))
```

## Stack

"Does this closer match the most recent opener?" is a stack. The most recent unmatched opener is the last item you append.

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
    return not stack

print(balanced("([])"), balanced("([)]"), balanced("("))
```

:::why
`([)]` fails because the most recent opener is `[`, and the next closer is `)`. A counter of "how many open" cannot see that mismatch. The stack remembers the order.
:::
