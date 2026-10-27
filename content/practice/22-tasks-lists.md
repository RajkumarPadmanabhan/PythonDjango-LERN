---
id: tasks-lists
track: practice
level: Beginner
module: Tasks
title: Tasks — lists and strings
minutes: 30
keywords: task, list, string, index, slice
summary: Reverse, palindrome, vowels, unique order, and the second largest value.
---

Strings and lists are both sequences. An index is a position. Do the work in a new list unless the task tells you to change the original.

## Task 1 — reverse

Return a new list, reversed. Do not call `reversed` or use a backward slice. Then try the slice and see that it matches.

:::solution
```python
def reverse(items):
    result = []
    for item in items:
        result.insert(0, item)
    return result

print(reverse([1, 2, 3]))
print([1, 2, 3][::-1])
```

Inserting at 0 teaches the idea and gets slow on long lists. `[::-1]` and `list(reversed(items))` are the versions you use after the idea is clear.
:::

## Task 2 — palindrome letters

Ignore case and anything that is not a letter or digit.

:::solution
```python
def is_palindrome(text):
    chars = [ch.casefold() for ch in text if ch.isalnum()]
    return chars == chars[::-1]

print(is_palindrome("A man, a plan, a canal: Panama"))
print(is_palindrome("nope"))
```
:::

## Task 3 — vowels

Count `a e i o u` in either case. `y` is not a vowel here.

:::solution
```python
def vowel_count(text):
    vowels = set("aeiou")
    count = 0
    for ch in text.casefold():
        if ch in vowels:
            count += 1
    return count

print(vowel_count("Queue"))
```
:::

## Task 4 — unique, same order

`["b", "a", "b"]` becomes `["b", "a"]`.

:::solution
```python
def unique(items):
    seen = set()
    result = []
    for item in items:
        if item in seen:
            continue
        seen.add(item)
        result.append(item)
    return result

print(unique(["b", "a", "b", "c", "a"]))
```
:::

## Task 5 — second largest

Use the values, not the positions. Duplicates of the largest do not count as second. Raise `ValueError` if there is no second value.

:::solution
```python
def second_largest(nums):
    best = None
    second = None
    for num in nums:
        if best is None or num > best:
            second = best
            best = num
        elif num != best and (second is None or num > second):
            second = num
    if second is None:
        raise ValueError("need two different values")
    return second

print(second_largest([3, 1, 3, 2]))
```
:::
