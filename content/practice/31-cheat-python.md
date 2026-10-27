---
id: cheat-python
track: practice
level: Reference
module: Cheat codes
title: Cheat codes — Python
minutes: 22
keywords: cheat, python, slice, dict, exception, comprehension
summary: The lines you look up while writing. Each one is a shape, not a full lesson.
---

The keyword reference and the builtins page are the catalogs. This page is the lines you copy the shape of.

## Names

```py
a, b = b, a
name, _, score = row
low, high = bounds()
```

:::how
Python evaluates the right-hand side completely, then binds the names on the left. `a, b = b, a` reads both old values first, so neither name is overwritten too early. `name, _, score = row` unpacks three items and uses `_` for the one you will not use. That is a convention, not a special keyword. `low, high = bounds()` only works when `bounds()` returns exactly two values.
:::

## Decisions

```py
if n < 0:
    raise ValueError("n cannot be negative")
label = "even" if n % 2 == 0 else "odd"
```

:::how
The `raise` is a guard. A negative never reaches the rest of the function. The one-line `if` chooses between two expressions. It is still one question: the test, then the value when it is true, then the value when it is false. `is None` checks identity, because `None` is a single object. `not items` is true for an empty list, and also for `0`, so do not use it when zero is a real number.
:::

`if x is None` for missing. `if not items` for an empty list. `if x` is the wrong test when `0` is a real value.

## Loops

```py
for index, item in enumerate(items, start=1):
    ...
for left, right in zip(names, scores, strict=True):
    ...
for n in range(1, limit + 1):
    ...
```

:::how
`enumerate` yields the position and the item. `start=1` makes the first position 1 instead of 0, which is what you want when you show a list to a person. `zip` walks two sequences together and stops at the shorter one unless `strict=True`, which raises when the lengths differ. `range(1, limit + 1)` includes `limit` because the stop value is excluded.
:::

`range` stops before the end. `zip(..., strict=True)` raises if the lengths differ.

## Lists and slices

```py
items[0]          # first
items[-1]         # last
items[1:4]        # index 1, 2, 3
items[:3]         # first three
items[-2:]        # last two
items[::2]        # every second
items[::-1]       # reverse
items[i:i + size] # one chunk
```

:::how
An index picks one item and raises `IndexError` when it does not exist. `0` is the first. `-1` counts from the end. A slice is `start:stop:step`. The stop is excluded, so `[1:4]` is indexes 1, 2, and 3. Omitted start means the beginning. Omitted stop means the end. A step of `-1` walks backward. A slice that runs past the end returns what is left instead of raising. `items[i:i + size]` is one chunk starting at `i`.
:::

A slice never raises for being too long. It returns what is there. An index does raise.

## Dicts and sets

```py
value = mapping.get("key", default)
mapping.setdefault(key, []).append(item)
tally[key] = tally.get(key, 0) + 1
if key in mapping:
    ...
unique = set(items)
shared = set(left) & set(right)
only_left = set(left) - set(right)
```

:::how
`get` returns the stored value, or the default when the key is missing, and it does not insert that default. `setdefault` inserts the default when the key is missing and returns the list, so `append` can run on it. The tally line reads the old count, or 0, adds 1, and stores it under the same key. `in` asks whether the key exists. `set` drops duplicates. `&` is the overlap of two sets. `-` is what the left set has that the right set does not.
:::

`get` does not insert. `setdefault` does.

## Keep, without a long loop

```py
kept = [n for n in nums if n > 0]
squares = {n: n * n for n in nums}
found = next((n for n in nums if n < 0), None)
```

:::how
Read a comprehension as "the value, for each item, if the test passes." `kept` builds a list of the numbers that pass. `squares` builds a dict whose key is `n` and whose value is `n * n`. `next` pulls the first item from the generator, and the second argument is what you get when there is no match. The filter is the `if`. There is no `elif` here. If the body also prints or writes a file, write a `for` loop instead. A comprehension is for building a value.
:::

A comprehension that also prints or saves a file is the wrong tool. Use a `for` loop when the step has a side effect.

## Functions

```py
def clamp(n, low=0, high=100):
    return min(high, max(low, n))

def first(items, default=None):
    return items[0] if items else default
```

:::how
`max(low, n)` lifts a small `n` up to `low`. `min(high, ...)` then pulls a large result down to `high`. The two calls together are a clamp. `first` uses a one-line `if` so an empty list returns the default instead of raising on `items[0]`. A default of `[]` or `{}` is shared by every call that omits the argument, because the default object is created once. Use `None`, then create a new list inside the function.
:::

Do not use a list or dict as a default argument. Use `None`, then create the list inside the function.

## Exceptions

```py
try:
    number = int(text)
except ValueError as exc:
    raise ValueError("not an integer") from exc
```

:::how
`try` runs `int`. A word raises `ValueError`, which this `except` catches. Other errors pass through. `raise ... from exc` replaces the message and keeps the original error attached, so the traceback still shows that `int` failed. `except Exception` also catches bugs you meant to see. A bare `except` catches `KeyboardInterrupt` too, so Ctrl+C can stop working.
:::

Catch the type you can handle. `except Exception` hides bugs. A bare `except` also hides `KeyboardInterrupt`.

## Files

```py
from pathlib import Path

text = Path("notes.txt").read_text(encoding="utf-8")
Path("out.txt").write_text(text, encoding="utf-8")
```

:::how
`Path` is the path object. `/` joins segments when you build a longer path. `read_text` opens, reads, and closes. `encoding="utf-8"` is the text encoding. Without it, the default can differ by machine on older Python. `write_text` replaces the file contents with the string you pass.
:::

## Sorting and the usual builtins

```py
ordered = sorted(words, key=str.casefold)
best = max(nums)
position = min(range(len(nums)), key=nums.__getitem__)
any_even = any(n % 2 == 0 for n in nums)
all_positive = all(n > 0 for n in nums)
```

:::how
`sorted` returns a new list. `key=str.casefold` tells it to compare folded letters, so case does not decide the order. `max` walks the values and keeps the largest. It raises on an empty list, because there is no largest item. `min(range(...), key=nums.__getitem__)` asks for the index whose value is smallest. `any` stops at the first true test. `all` stops at the first false test. An empty `all` is `True`, because there is no failure.
:::

`max([])` raises. Check empty first when empty is a normal case.

## Counts from the standard library

```py
from collections import Counter

Counter("abca").most_common(1)
```

:::how
`Counter` is a dict of counts. Passing a string counts characters. `most_common(1)` returns a list of one pair, `(item, count)`, sorted by count descending. You still write the loop yourself when you are learning the shape. Reach for `Counter` when the count is the whole job.
:::

## The lines that look clever and are wrong

| Wrong | Use |
| --- | --- |
| `if x == None` | `if x is None` |
| `if x == True` | `if x` or `if x is True` |
| `except:` | `except ValueError:` |
| `items = items.append(x)` | `items.append(x)` |
| `def f(items=[])` | `def f(items=None)` then `items = [] if items is None else items` |
| `range(len(items))` just to get the item | `for item in items` or `enumerate` |

:::how
`== None` can be true for an object that defines a weird equality. `is None` asks whether it is the `None` object. `append` returns `None`, so assigning `items = items.append(x)` throws the list away and stores `None`. A mutable default is created once and reused. `range(len(items))` exists to get indexes. If you only need the item, iterate the items.
:::

:::tip
If you need a keyword, operator, or dunder that is not on this page, use the Reference track. Those pages are the full lists. This page is the working set.
:::
