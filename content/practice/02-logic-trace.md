---
id: logic-trace
track: practice
level: Beginner
module: Logic building
title: Trace every name by hand
minutes: 16
keywords: trace, variable, loop, off-by-one, debug
summary: Write a row each time a name changes. If your row and the program disagree, the bug is in the step you just wrote.
---

Tracing is pretending to be Python, slowly. You keep a table. Each name is a column. Each time a name changes, you write a new row.

```python
def total(nums):
    result = 0
    for num in nums:
        result = result + num
    return result

print(total([4, 1, 7]))
```

:::how
`result = 0` is the sum before any number is seen. The `for` takes one item at a time into `num`. `result = result + num` reads the old total, adds the item, and stores the new total under the same name. After 4, 1, and 7 the name holds 12. `return` sends that number out. The list is not modified.
:::

| step | num | result |
| --- | --- | --- |
| start |  | 0 |
| first item | 4 | 4 |
| second | 1 | 5 |
| third | 7 | 12 |
| return |  | 12 |

If you cannot fill the table, you do not understand the code yet. That is useful. Stop and name the step you cannot fill.

## The usual off-by-one

```python
def count_up(n):
    i = 1
    while i <= n:
        print(i)
        i = i + 1

count_up(3)
```

:::how
`i` starts at 1, which is the first number you want to print. The `while` checks `i <= n` before the body. For `n` of 3 the body runs at 1, 2, and 3. `i = i + 1` is what moves the name forward. Without it, `i` would stay 1 and the condition would stay true. When `i` becomes 4, `4 <= 3` is false and the loop stops.
:::

`i <= n` prints 1, 2, 3. `i < n` would stop before 3. `range(1, n)` also stops before `n`, because the stop value is excluded. `range(1, n + 1)` matches the `while` above.

:::why
The loop condition is checked before the body. When `i` becomes 4, `4 <= 3` is false, so `print` does not run. Forgetting to change `i` makes the condition true forever.
:::

:::watch
Starting a total at 1 instead of 0 adds a phantom item. Starting a count at 1 counts an item that never arrived. Empty input should return 0 for a sum and 0 for a count. Trace `[]` as its own row: the loop body never runs, so the start value is the answer.
:::

:::try
Trace `total([])` and `total([5])`. Write the rows before you run anything.
:::

:::solution
`total([])` has one row: `result` is 0, the loop does not run, return 0. `total([5])` goes 0, then `num` is 5 and `result` is 5. One item is not a special case if your start value is the identity for the operation: 0 for sums, 1 for products, `[]` for lists you build.
:::
