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

:::how
`casefold()` makes `A` and `a` the same key. `isalpha()` is false for `!`, and `continue` skips that character so it never becomes a key. `get(ch, 0)` returns the stored count, or 0 when the letter is new. Adding 1 and storing it back is the whole update. `"Ada!"` ends as `{"a": 2, "d": 1}`.
:::
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

:::how
A dict can hold one value per key. After the swap, the old value is the key. If that new key is already in `flipped`, a second old key would overwrite it and a pair would disappear, so the function raises instead. Otherwise `flipped[value] = key` stores the reversed pair. The new dict is built from scratch. The input dict is not modified.
:::
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

:::how
`len(word)` is the group key. `setdefault(len(word), [])` returns the list already stored for that length, or inserts a fresh `[]` the first time and returns that. `append` then adds the word to the list it got back. One line both creates the group and extends it. `"cat"` and `"dog"` share length 3, so they land in the same list, in the order they were seen.
:::
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

:::how
`enumerate` gives the position and the value together. `need` is the other number that would finish the pair. `seen` maps a number already passed to the index where it appeared. The `if` looks up `need` before the current number is stored. For `[2, 7]` and target 9, 2 is stored as index 0, then 7 computes `need` 2, finds it, and returns `(0, 1)`. Looking up first is why `[3, 3]` works: the second 3 finds the first 3. Storing first would let a single 3 pair with itself.
:::

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

:::how
The dict stores the count after each item. The `if` updates `best` only when the new count is strictly greater, or when `best` is still `None` on the first item. A tie does not replace `best`, because `>` is false when the counts are equal, so the earlier value stays. `b` reaches 3 and wins. `best_count` is remembered so the next item can be compared without scanning the dict again.
:::
:::
