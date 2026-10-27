---
id: tasks-decisions
track: practice
level: Beginner
module: Tasks
title: Tasks — decisions
minutes: 25
keywords: task, if, elif, function
summary: Six short functions. Each one is a decision. Try them before you open the solution.
---

Write each function yourself. Run your version, then open the solution and compare the shape, not only the result.

Rules for every task: return a value. Do not print inside the function. Reject nonsense with `ValueError` when the task says so.

## Task 1 — even

Return `True` when `n` is even.

Examples: `2 → True`, `7 → False`, `0 → True`.

:::solution
```python
def is_even(n):
    return n % 2 == 0

print(is_even(2), is_even(7), is_even(0))
```

:::how
`%` divides and keeps the remainder. An even number divides by 2 with remainder 0, so `n % 2 == 0` is `True` for 2 and 0, and `False` for 7. The function returns that boolean. `print` calls it three times so you can see all three cases, including 0, which is even.
:::
:::

## Task 2 — larger of two

Return the larger number. If they are equal, return that number.

:::solution
```python
def larger(a, b):
    if a >= b:
        return a
    return b

print(larger(3, 9), larger(4, 4), larger(-1, -5))
```

:::how
The `if` asks one question: is `a` greater or equal? If yes, `a` is the answer and `return` leaves the function immediately, so the last line does not run. If no, `b` must be larger, and that is the only line left. `>=` rather than `>` is why equal numbers return `a` instead of falling through. Negatives work because `-1` is greater than `-5`.
:::
:::

## Task 3 — absolute value

Return the number if it is zero or positive. Return its opposite if it is negative. Do not call `abs`.

:::solution
```python
def absolute(n):
    if n < 0:
        return -n
    return n

print(absolute(-8), absolute(0), absolute(3))
```

:::how
The sign is the only decision. `n < 0` is true for `-8`, and `-n` flips the sign, so `-(-8)` is `8`. `return` stops there. Zero and positive numbers fail the test, so they are already the absolute value and are returned unchanged. No library call is required because negating a negative is the definition.
:::
:::

## Task 4 — one fizz

Given one integer, return `"Fizz"` if it is divisible by 3, `"Buzz"` if by 5, `"FizzBuzz"` if by both, otherwise the number as text.

:::solution
```python
def fizz(n):
    if n % 15 == 0:
        return "FizzBuzz"
    if n % 3 == 0:
        return "Fizz"
    if n % 5 == 0:
        return "Buzz"
    return str(n)

print(fizz(3), fizz(5), fizz(15), fizz(2))
```

:::how
Each `if` returns, so only one answer can come out. `n % 15 == 0` means 15 divides `n`, which is true only when both 3 and 5 do. That test is first because 15 is also divisible by 3: if the `% 3` test came first, 15 would return `"Fizz"` and never reach `"FizzBuzz"`. After the special cases, `str(n)` turns the leftover number into text so every path returns a string.
:::
:::

## Task 5 — grade

`90+` is `"A"`, `80–89` is `"B"`, `70–79` is `"C"`, otherwise `"retry"`. Raise `ValueError` if the score is outside 0 to 100.

:::solution
```python
def grade(score):
    if not 0 <= score <= 100:
        raise ValueError("score must be from 0 to 100")
    if score >= 90:
        return "A"
    if score >= 80:
        return "B"
    if score >= 70:
        return "C"
    return "retry"

print(grade(91), grade(80), grade(70), grade(69))
```

:::how
`0 <= score <= 100` is two comparisons chained. `not` flips it, so anything outside that range raises and never gets a grade. The bands are highest first. 91 matches `>= 90` and returns. 80 fails `>= 90` and matches `>= 80`. 69 fails every band, so `retry` is the leftover, not a separate test.
:::
:::

## Task 6 — sign

Return `1`, `0`, or `-1`.

:::solution
```python
def sign(n):
    if n > 0:
        return 1
    if n < 0:
        return -1
    return 0

print(sign(12), sign(0), sign(-2))
```

:::how
Three mutually exclusive cases. A positive number returns `1` and stops. A negative number fails the first test, matches the second, and returns `-1`. Zero fails both tests, so the last line is the only remaining answer. The order matters only in that zero must not be caught by `>` or `<`.
:::
:::

:::quiz
Why does fizz check 15 before 3?
+ A multiple of both would match the "only 3" test if that test came first
- 15 is smaller than 3
- Python requires larger numbers first
because: The first true branch wins. "Both" is more specific than "only 3," so it has to be asked first.
:::
