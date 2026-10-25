---
id: break-continue-else
track: python
level: Beginner
module: Control flow
title: break, continue, and the loop else
minutes: 12
keywords: break, continue, else, pass
summary: break leaves the loop. continue skips to the next item. A loop's else runs only when the loop did not break.
---

```python
for n in range(10):
    if n == 2:
        continue
    if n == 5:
        break
    print(n)
```

`continue` skips the rest of the body and advances. `break` leaves the loop entirely. The numbers printed are `0`, `1`, `3`, `4`.

## else on a loop

A `for` or `while` may have an `else` block. It runs when the loop finishes without `break`. It does not run when you break. This is useful for search.

```python
numbers = [2, 4, 6, 7]
for n in numbers:
    if n % 2 == 1:
        print("found odd", n)
        break
else:
    print("all even")
```

If you remove `7`, the `else` runs. People misread this `else` as "runs when the loop never ran." That is not the rule. An empty loop also takes the `else`, because it did not `break`.

:::why
The else belongs to the loop, not to an if inside it. The indentation has to match the `for`. The mental model is "else means no break," which is the same idea as "search failed."
:::

## pass

`pass` is a statement that does nothing. You need it when the grammar demands a block and you have nothing to put there yet.

```python
def later():
    pass
```

`...` (the `Ellipsis` literal) is also used as a placeholder in stubs. `pass` is the keyword.

## Nested loops

`break` and `continue` affect the innermost loop only. To leave an outer loop, return from a function, or set a flag, or restructure. A function return is usually the clean version.

:::watch
`continue` in a `while` loop can skip the counter update and spin forever:

```python
n = 0
while n < 5:
    if n == 3:
        continue
    print(n)
    n += 1
```

Move `n += 1` before the `continue`, or use `for`.
:::

:::try
Scan the list `[1, 3, 5, 8]` and print the first even number. If there is none, print `none`. Use `for` / `else`, not a flag.
:::

:::solution
```python
for n in [1, 3, 5, 8]:
    if n % 2 == 0:
        print(n)
        break
else:
    print("none")
```
:::

:::quiz
When does a for-loop's else block run?
+ When the loop ends without executing break
- When the loop body never ran
- When the last item was false
because: else on a loop means the search did not break. It is not the else of an if.
:::
