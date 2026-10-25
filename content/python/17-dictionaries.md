---
id: dictionaries
track: python
level: Beginner
module: Collections
title: Dictionaries
minutes: 20
keywords: dict, key, get, items, hash, unpack
summary: A dict maps hashable keys to values and keeps insertion order. Lookup by key is the point.
---

```python
user = {"name": "Ada", "active": True}
user["email"] = "ada@example.com"
print(user["name"])
print(user.get("phone"))
print(user.get("phone", "missing"))
```

`user["phone"]` raises `KeyError` when the key is absent. `get` returns `None` or a default you supply, and does not insert the key.

Keys must be hashable: `str`, `int`, `tuple` of hashables, `frozenset`, `frozendict` when its contents are hashable. Lists and dicts are not hashable. Values can be anything.

Since Python 3.7, dicts preserve insertion order as part of the language, not as an accident.

## Building and merging

```python
scores = dict(ada=10, grace=9)
extra = {"ada": 12, "linus": 8}
merged = scores | extra
print(merged)
scores |= {"ada": 11}
print(scores)
```

`|` on dicts (3.9+) returns a new dict. The right side wins when keys collide. `|=` updates in place.

```python
squares = {n: n * n for n in range(4)}
print(squares)
```

## Update carefully

```python
counts = {}
for word in ["a", "b", "a"]:
    counts[word] = counts.get(word, 0) + 1
print(counts)
```

`collections.Counter` and `collections.defaultdict` exist for this pattern. Learn the plain version first so the helper is not magic.

```python
from collections import defaultdict, Counter
print(Counter(["a", "b", "a"]))
groups = defaultdict(list)
groups["py"].append("django")
print(groups["missing"], groups["py"])
```

`defaultdict(list)` calls `list()` when a missing key is read. That read inserts the new list. A normal dict would have raised `KeyError`.

## Removing and iterating

```python
user = {"name": "Ada", "role": "admin"}
role = user.pop("role")
print(role, "name" in user)
for key, value in user.items():
    print(key, value)
```

`pop(key, default)` can avoid `KeyError`. `del user[key]` removes a key and returns nothing. Iterating `.items()` while inserting keys raises `RuntimeError`. Build a new dict, or iterate over `list(user)`.

:::why
Lookup is fast because a key's hash selects a slot. If two keys hash alike, Python compares them with `==`. That is why a key must not change its hash while it sits in the dict. Mutating a list would do that, so lists are unhashable. It is also why you never mutate an object you are using as a key.
:::

:::watch
`get` with a default does not store the default. If you wanted "insert this list if missing, then append," use `setdefault` or `defaultdict`.

```python
user = {}
user.setdefault("roles", []).append("editor")
print(user)
```
:::

:::try
Turn the list of pairs `[("a", 1), ("b", 2)]` into a dict, then print the value for `"b"` and a fallback for `"z"`.
:::

:::solution
```python
pairs = [("a", 1), ("b", 2)]
data = dict(pairs)
print(data["b"], data.get("z", 0))
```
:::

:::quiz
Why can't a list be a dictionary key?
+ Lists are mutable, so their hash could change and break the lookup
- Lists are too long
- Dictionaries only accept strings
because: A key's hash must stay stable. Mutable lists are unhashable on purpose.
:::
