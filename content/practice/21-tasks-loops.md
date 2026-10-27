---
id: tasks-loops
track: practice
level: Beginner
module: Tasks
title: Tasks — loops
minutes: 30
keywords: task, loop, sum, count, factorial
summary: Count, total, find, and keep. Each task is one loop job.
---

Use a `for` loop unless the task is about "until." Start from the empty answer: `0`, `[]`, or "not found yet."

## Task 1 — sum

Return the sum of a list of numbers. An empty list sums to 0. Do not call `sum`.

:::solution
```python
def add_all(nums):
    result = 0
    for num in nums:
        result += num
    return result

print(add_all([4, 1, 7]), add_all([]))
```
:::

## Task 2 — count evens

:::solution
```python
def count_evens(nums):
    count = 0
    for num in nums:
        if num % 2 == 0:
            count += 1
    return count

print(count_evens([1, 2, 3, 4, 6]))
```
:::

## Task 3 — all positive

Return `True` only when every number is greater than 0. An empty list is `True`: there is no counterexample.

:::solution
```python
def all_positive(nums):
    for num in nums:
        if num <= 0:
            return False
    return True

print(all_positive([1, 2]), all_positive([1, 0]), all_positive([]))
```
:::

## Task 4 — factorial

`factorial(0)` is 1. `factorial(5)` is 120. Raise `ValueError` for a negative.

:::solution
```python
def factorial(n):
    if n < 0:
        raise ValueError("n cannot be negative")
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result

print(factorial(0), factorial(5))
```
:::

## Task 5 — keep the positives

Return a new list. Leave the original unchanged.

:::solution
```python
def positives(nums):
    kept = []
    for num in nums:
        if num > 0:
            kept.append(num)
    return kept

data = [-1, 0, 4, 2]
print(positives(data), data)
```
:::

## Task 6 — first longer than n

Return the first word whose length is greater than `n`, or `None`.

:::solution
```python
def first_longer(words, n):
    for word in words:
        if len(word) > n:
            return word
    return None

print(first_longer(["a", "cat", "horse"], 3))
print(first_longer(["a", "be"], 3))
```
:::
