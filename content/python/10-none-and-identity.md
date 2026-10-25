---
id: none-and-identity
track: python
level: Beginner
module: Data
title: None and identity
minutes: 14
keywords: None, is, id, equality, sentinel
summary: None is one shared object meaning "no value." Test it with is. Equality and identity answer different questions.
---

`None` is the object Python uses for "there is no value." Functions that do not return anything return `None`. A missing optional is often `None`.

```python
def announce(message):
    print(message)

result = announce("hi")
print(result is None)
```

There is exactly one `None` object. That is why the test is `value is None` or `value is not None`, not `value == None`. Equality can be customized by a class. Identity cannot, except by breaking the language.

## is versus ==

`==` asks "do these look equal?" and calls `__eq__`. `is` asks "are these the same object?" and compares identities.

```python
print(1 == 1.0)
print(1 is 1.0)
print([] == [])
print([] is [])
```

Two empty lists compare equal and are not the same object. `is` on small integers sometimes looks true because CPython reuses a few interned integers. Do not depend on that. Use `is` for `None`, for sentinels, and when you truly mean identity. Use `==` for values.

`id(obj)` returns an integer that is unique for the object during its lifetime. It is a debugging tool, not a database key.

## Sentinels

Sometimes `None` is a real value a caller might pass, and you need a separate "argument was omitted" marker.

```python
NO_DEFAULT = object()

def get_setting(config, key, default=NO_DEFAULT):
    if key not in config:
        if default is NO_DEFAULT:
            raise KeyError(key)
        return default
    return config[key]

print(get_setting({"a": None}, "a"))
print(get_setting({}, "missing", default=None))
```

`object()` creates a unique object. Compare it with `is`.

On Python 3.15 the built-in `sentinel` does this with a readable representation:

```python
# Python 3.15+
# MISSING = sentinel("MISSING")
# def load(default=MISSING):
#     if default is MISSING:
#         raise LookupError("default required")
#     return default
```

`sentinel(name, /, *, repr=None)` takes the name as a positional-only argument. Assign it once at module level and reuse that object. Sentinels are truthy, compare equal only to themselves, and can be pickled when the variable name matches.

:::watch
`if not value` treats `None`, `0`, and `""` the same. If zero is a legitimate temperature or price, test `value is None` instead of relying on truthiness.
:::

:::quiz
Which test is correct for a missing value represented by None?
+ value is None
- value == None
- value is not False
because: None is a single object. is checks identity and cannot be overridden by a type's equality method.
:::
