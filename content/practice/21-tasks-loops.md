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

:::how
`result` starts at 0, which is the sum of nothing. Each pass replaces `result` with `result + num`, so the name remembers the total so far: 0, then 4, then 5, then 12. The loop does not run for `[]`, so the start value is returned unchanged. `+=` is the same addition, written shorter.
:::
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

:::how
`count` starts at 0 because nothing has been seen. The `if` asks whether this number is even. Only then does `count += 1` run. Odd numbers are skipped, not stored. After the last item, `count` is the answer. The list itself is never changed.
:::
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

:::how
The loop is hunting for a counterexample. The first number that is `<= 0` proves the answer is `False`, so `return` stops early. If the loop finishes, no counterexample existed, and `True` is correct. An empty list has no counterexample, so it returns `True` without entering the loop.
:::
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

:::how
A negative has no factorial here, so the guard raises before any multiplying. `result` starts at 1, the identity for multiplication: multiply by 1 and the value stays. `range(2, n + 1)` yields 2, 3, 4, 5 for `n` of 5. The stop value is excluded, so `n + 1` is what includes `n`. For 0, `range(2, 1)` is empty, the loop never runs, and 1 is returned, which is `factorial(0)`.
:::
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

:::how
`kept` is a new list. `append` adds to that list only when the test passes. The original `data` is never assigned to, so printing it afterward shows the same values. Returning `kept` means the caller receives the filtered copy. Zero fails `> 0`, so it is left out.
:::
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

:::how
`len(word) > n` is the whole test. `"cat"` has length 3, which is not greater, so the loop continues. `"horse"` matches, and `return` hands that word back immediately. Later words are not inspected. If the loop ends, nothing matched, so `None` means "missing" rather than `""`, which could be a real word.
:::
:::
