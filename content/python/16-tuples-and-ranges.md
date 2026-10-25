---
id: tuples-and-ranges
track: python
level: Beginner
module: Collections
title: Tuples, ranges, and unpacking
minutes: 14
keywords: tuple, unpack, range, namedtuple, star
summary: A tuple is an ordered immutable sequence. Immutability is about the tuple, not about the objects inside it.
---

```python
point = (3, 4)
x, y = point
print(x, y)
one = (1,)
empty = ()
print(len(one), len(empty))
```

Parentheses are often optional: `x, y = 1, 2` builds a tuple on the right and unpacks it. A one-item tuple needs a comma. `(1)` is just the number 1 in parentheses.

Tuples are immutable. You cannot assign to `point[0]`. If a tuple holds a list, the list can still be mutated. Immutability is shallow.

```python
pair = ([1], [2])
pair[0].append(9)
print(pair)
```

Because a tuple is immutable and hashable when every item is hashable, it can be a dict key. A list cannot.

## Extended unpacking

```python
first, *middle, last = [1, 2, 3, 4]
print(first, middle, last)
```

`*middle` collects whatever is left into a list. This works in assignments, function calls, and (since 3.15) comprehensions, covered in the comprehensions lesson.

## namedtuple

When positions get confusing, name them.

```python
from collections import namedtuple
Point = namedtuple("Point", ["x", "y"])
p = Point(3, 4)
print(p.x, p.y, p[0])
```

A `dataclass` is usually the better modern choice when you want methods or defaults. `namedtuple` stays useful as a tiny immutable record.

## range is not a tuple

`range` is its own immutable sequence type. It stores the start, stop, and step, not every number. `3 in range(10**12)` is fast. `3 in list(range(10**12))` would try to allocate a huge list.

:::tip
Return a tuple from a function when the result is a fixed record, like `divmod`. Return a list when the caller should be free to append.
:::

:::quiz
How do you write a tuple of one item, the number 5?
+ (5,)
- (5)
- tuple(5)
because: The comma builds the tuple. Parentheses alone only group an expression. tuple(5) fails because an int is not iterable.
:::
