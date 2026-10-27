---
id: logic-edges
track: practice
level: Intermediate
module: Logic building
title: The cases that break beginners
minutes: 16
keywords: edge case, empty, none, duplicate, negative
summary: Empty, one item, duplicates, negatives, and None are part of the problem. Write them as examples before the happy path works.
---

A solution that works on `[1, 2, 3]` and fails on `[]` is unfinished. These cases show up in real data: a new user has no tasks, a form field is blank, two people share a name.

| Case | Question to ask |
| --- | --- |
| Empty | What is the answer when there is nothing to loop over? |
| One item | Does "second" or "previous" exist? |
| Duplicates | Should both stay, or only the first? |
| Negative or zero | Is it valid input or a bug? |
| `None` | Did the caller mean "missing," and is that different from 0 or `""`? |

```python
def max_or_none(nums):
    if not nums:
        return None
    best = nums[0]
    for num in nums[1:]:
        if num > best:
            best = num
    return best

print(max_or_none([]), max_or_none([4]), max_or_none([3, 3, 1]))
```

:::how
The empty check returns `None` before `nums[0]`, which would raise `IndexError` on `[]`. `best` then starts as the first item, not as 0. Starting at 0 would make `[-5, -1]` return 0, and 0 is not in that list. The loop walks the rest of the list. A strictly greater number replaces `best`. An equal number does not. One item never enters `nums[1:]`, so the first item is the max.
:::

Starting `best` at 0 is wrong for a list of negatives: `[-5, -1]` would return 0, which is not in the list. Starting at the first item fixes that, and the empty check happens before you touch index 0.

:::why
`None` means "there is no maximum," which is different from a maximum of 0. Callers test it with `is None`. If you returned 0 for an empty list, a caller could not tell "no data" from "the max really is 0."
:::

:::watch
`if not nums` is true for `[]`, `""`, `0`, and `None`. That is handy at the start of a function that should reject all of those. It is the wrong test when `0` is a legal number. Use `nums is None` when zero must survive.
:::
