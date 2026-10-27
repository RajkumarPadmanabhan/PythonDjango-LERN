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

The right-hand side finishes before any name on the left changes.

## Decisions

```py
if n < 0:
    raise ValueError("n cannot be negative")
label = "even" if n % 2 == 0 else "odd"
```

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

`get` does not insert. `setdefault` does.

## Keep, without a long loop

```py
kept = [n for n in nums if n > 0]
squares = {n: n * n for n in nums}
found = next((n for n in nums if n < 0), None)
```

A comprehension that also prints or saves a file is the wrong tool. Use a `for` loop when the step has a side effect.

## Functions

```py
def clamp(n, low=0, high=100):
    return min(high, max(low, n))

def first(items, default=None):
    return items[0] if items else default
```

Do not use a list or dict as a default argument. Use `None`, then create the list inside the function.

## Exceptions

```py
try:
    number = int(text)
except ValueError as exc:
    raise ValueError("not an integer") from exc
```

Catch the type you can handle. `except Exception` hides bugs. A bare `except` also hides `KeyboardInterrupt`.

## Files

```py
from pathlib import Path

text = Path("notes.txt").read_text(encoding="utf-8")
Path("out.txt").write_text(text, encoding="utf-8")
```

## Sorting and the usual builtins

```py
ordered = sorted(words, key=str.casefold)
best = max(nums)
position = min(range(len(nums)), key=nums.__getitem__)
any_even = any(n % 2 == 0 for n in nums)
all_positive = all(n > 0 for n in nums)
```

`max([])` raises. Check empty first when empty is a normal case.

## Counts from the standard library

```py
from collections import Counter

Counter("abca").most_common(1)
```

## The lines that look clever and are wrong

| Wrong | Use |
| --- | --- |
| `if x == None` | `if x is None` |
| `if x == True` | `if x` or `if x is True` |
| `except:` | `except ValueError:` |
| `items = items.append(x)` | `items.append(x)` |
| `def f(items=[])` | `def f(items=None)` then `items = [] if items is None else items` |
| `range(len(items))` just to get the item | `for item in items` or `enumerate` |

:::tip
If you need a keyword, operator, or dunder that is not on this page, use the Reference track. Those pages are the full lists. This page is the working set.
:::
