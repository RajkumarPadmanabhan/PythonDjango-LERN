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

:::how
The first loop only counts. `get(item, 0) + 1` is "zero if new, otherwise the old count, plus one." The second loop looks for the largest count. `best_count` starts at `-1` so the first real count, even 0, can win. `>` keeps the first item when two counts are equal, because an equal count does not replace `best_item`.
:::

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

:::how
`left` and `right` are indexes, not the values. The sum of the values at those ends is compared with the target. Too small means the left value must grow, and in a sorted list the way to grow it is `left += 1`. Too big means the right value must shrink, so `right -= 1`. A match returns the two values. `left < right` stops when the indexes meet, so a value is not paired with itself. None of those moves is valid if the list is unsorted, because moving right would not reliably shrink the sum.
:::

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

:::how
The guard rejects a window that cannot exist. `sum(nums[:k])` is the first window, and `best` starts there because it is a candidate. The loop begins at index `k`, the first item not in that window. `nums[i]` enters. `nums[i - k]` is the item that just slid out. Subtracting it and adding the new one updates the sum without recounting. `>` replaces `best` only for a strictly larger window.
:::

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

:::how
Openers are appended. The last item in `stack` is the opener that is still waiting. A closer looks up the opener it requires in `pairs`, then `pop()` removes the most recent opener and compares. Both the empty-stack check and the mismatch return `False`. `([)]` pops `[` when it sees `)`, and those are not a pair. After the loop, `not stack` is true only when every opener was closed. `"("` leaves one item, so it is false.
:::

:::why
`([)]` fails because the most recent opener is `[`, and the next closer is `)`. A counter of "how many open" cannot see that mismatch. The stack remembers the order.
:::
