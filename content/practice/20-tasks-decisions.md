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

Check 15 before 3. A number divisible by both is divisible by 3, so the combined test has to win first. `15` is 3 times 5, so `% 15` is the "both" test for these two factors.
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
:::

:::quiz
Why does fizz check 15 before 3?
+ A multiple of both would match the "only 3" test if that test came first
- 15 is smaller than 3
- Python requires larger numbers first
because: The first true branch wins. "Both" is more specific than "only 3," so it has to be asked first.
:::
