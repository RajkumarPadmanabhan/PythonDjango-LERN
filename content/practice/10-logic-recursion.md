---
id: logic-recursion
track: practice
level: Advanced
module: Logic building
title: Recursion is a smaller copy of the same problem
minutes: 16
keywords: recursion, base case, call stack
summary: A recursive function solves a smaller input and combines the answer. It must have a case that does not call itself.
---

Recursion is a decision plus a smaller problem. You need two parts:

1. **Base case.** The input is so small the answer is obvious. Do not call the function again.
2. **Recursive case.** Use the answer for a smaller input to build this answer.

```python
def total(nums):
    if not nums:
        return 0
    return nums[0] + total(nums[1:])

print(total([4, 1, 7]))
```

`total([4, 1, 7])` is `4 + total([1, 7])`. That is `4 + 1 + total([7])`. That is `4 + 1 + 7 + total([])`. The empty list returns 0 and the additions finish on the way back.

The same job as a loop is usually clearer:

```python
def total_loop(nums):
    result = 0
    for num in nums:
        result += num
    return result
```

Use recursion when the data is naturally nested, such as a tree of folders or comments that have replies. Use a loop for a flat list.

:::why
Each call waits for the smaller call. Python stores those waiting calls on a stack. There is no automatic tail-call removal, so a recursive loop over a huge list can hit `RecursionError`. The default limit is high enough for trees of modest depth and too low for "walk a million numbers."
:::

:::watch
A missing base case never returns. `total` without the empty check calls `total([])`, then tries `nums[0]` and raises `IndexError`. Forgetting to shrink the input (`total(nums)` instead of `total(nums[1:])`) recurses until the stack limit.
:::

:::quiz
What must a recursive function have?
+ A base case that returns without calling itself, and a call on a smaller input
- A while loop inside the recursive call
- A global variable to store the answer
because: The base case is what stops the calls. The smaller input is what moves toward that case.
:::
