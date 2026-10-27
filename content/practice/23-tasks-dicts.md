---
id: tasks-dicts
track: practice
level: Intermediate
module: Tasks
title: Tasks — dictionaries
minutes: 28
keywords: task, dict, count, group, lookup
summary: Count, invert, group, and find a pair. The dict is the memory of the loop.
---

## Task 1 — character counts

Count letters only. Ignore case. Return a dict.

:::solution
```python
def letter_counts(text):
    tally = {}
    for ch in text.casefold():
        if not ch.isalpha():
            continue
        tally[ch] = tally.get(ch, 0) + 1
    return tally

print(letter_counts("Ada!"))
```
:::

## Task 2 — invert

Swap keys and values. Raise `ValueError` if two keys share a value, because the swap would drop one.

:::solution
```python
def invert(mapping):
    flipped = {}
    for key, value in mapping.items():
        if value in flipped:
            raise ValueError(f"duplicate value: {value}")
        flipped[value] = key
    return flipped

print(invert({"a": 1, "b": 2}))
```
:::

## Task 3 — group by length

Return a dict of lists. `"a cat"` becomes `{1: ["a"], 3: ["cat"]}`.

:::solution
```python
def by_length(words):
    groups = {}
    for word in words:
        groups.setdefault(len(word), []).append(word)
    return groups

print(by_length(["a", "cat", "be", "dog"]))
```
:::

## Task 4 — two indexes that add to a target

Return the two indexes, or `None`. The same index may not be used twice. The list is not sorted.

:::solution
```python
def two_sum(nums, target):
    seen = {}
    for index, num in enumerate(nums):
        need = target - num
        if need in seen:
            return seen[need], index
        seen[num] = index
    return None

print(two_sum([2, 7, 11, 15], 9))
print(two_sum([3, 3], 6))
```

Store the index after the lookup so a number is not paired with itself.
:::

## Task 5 — mode

Return the value that appears most. If there is a tie, return the one that appeared first.

:::solution
```python
def mode(items):
    tally = {}
    best = None
    best_count = 0
    for item in items:
        tally[item] = tally.get(item, 0) + 1
        if best is None or tally[item] > best_count:
            best = item
            best_count = tally[item]
    return best

print(mode(["b", "a", "b", "a", "b"]))
```
:::
