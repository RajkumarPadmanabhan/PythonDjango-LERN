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

:::how
`insert(0, item)` puts each new item at the front. Walking 1, then 2, then 3 produces `[1]`, then `[2, 1]`, then `[3, 2, 1]`. That is the reverse, built by hand. `[::-1]` means start at the beginning, stop at the end, step `-1`, so Python walks backward and builds the same list in one expression. Use the slice once the insert version makes sense.
:::

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

:::how
The comprehension keeps a character only when `isalnum()` is true, and `casefold()` makes `A` and `a` the same letter. Spaces, commas, and the colon drop out. `chars[::-1]` is that cleaned list backward. `==` compares the two lists item by item. Equal means every position matches its mirror, which is the definition of a palindrome after cleaning.
:::
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

:::how
`set("aeiou")` makes membership a single question: `ch in vowels`. `casefold()` runs first so `Q` and `E` are compared as lowercase. `y` is not in the set, so it is not counted. Each match adds 1 to `count`. `"Queue"` contributes `u`, `e`, `u`, `e`: four.
:::
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

:::how
`seen` answers "have I already kept this?" `ordered` remembers the first-seen order, which a set would throw away. The `if` skips duplicates with `continue`, so `append` runs only for a new item. `b` is added first, the second `b` is skipped, then `a`, then `c`. Both structures are updated together: look up, then record.
:::
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

:::how
`best` is the largest so far. `second` is the next largest different value. When `num` beats `best`, the old `best` slides down into `second` before `best` is replaced. That slide is why a new champion does not erase the runner-up. The `elif` ignores another copy of `best` (`num != best`) and updates `second` only for a value strictly between. If `second` is still `None` at the end, every value was identical, so there is no second place to return.
:::
:::
