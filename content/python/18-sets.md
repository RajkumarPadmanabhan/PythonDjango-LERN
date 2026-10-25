---
id: sets
track: python
level: Beginner
module: Collections
title: Sets and frozendict
minutes: 14
keywords: set, frozenset, frozendict, union, hash
summary: A set stores unique hashable items and answers membership quickly. frozendict is an immutable mapping, new in 3.15.
---

```python
colors = {"red", "blue", "red"}
print(colors)
colors.add("green")
print("red" in colors)
```

A set has no duplicates and no indexes. Order is not part of the promise you should rely on for display, even if a given run looks stable. Use a set for membership and for mathematical combination.

```python
a = {1, 2, 3}
b = {3, 4}
print(a | b)  # union
print(a & b)  # intersection
print(a - b)  # difference
print(a ^ b)  # symmetric difference
```

`frozenset` is the immutable, hashable version. It can be a dict key or a set item.

An empty set is `set()`, not `{}`. `{}` is an empty dict.

## When a set is the wrong tool

If you need duplicates, use a list. If you need order of insertion as part of the meaning, use a list or a dict. If you need counts, use `Counter`.

## frozendict

Python 3.15 adds `frozendict`, a built-in immutable mapping. It is **not** a subclass of `dict`. It preserves insertion order, but equality ignores order. It is hashable when every key and value is hashable.

```python
# Python 3.15+
# settings = frozendict(debug=False, page_size=20)
# settings["debug"] = True  # TypeError
# hash(settings)
```

`isinstance(value, dict)` is false for a `frozendict`. Code that should accept any mapping should test `collections.abc.Mapping`. `json` and several other stdlib modules accept `frozendict`.

:::why
Set membership is an average O(1) hash lookup, like dict keys. `x in some_list` walks the list. For a large collection of unique ids you only test with `in`, a set is the right structure. For a short list you build once, the list is fine and simpler.
:::

:::try
Given the words `["py", "dj", "py"]`, build a set and print how many unique words there are.
:::

:::solution
```python
words = ["py", "dj", "py"]
print(len(set(words)))
```
:::

:::quiz
What is the value of {} and of set()?
+ {} is an empty dict. set() is an empty set
- Both are empty sets
- Both are empty dicts
because: Brace literals with no colon pairs are dicts. Sets need at least one item in a literal, or the set() constructor.
:::
