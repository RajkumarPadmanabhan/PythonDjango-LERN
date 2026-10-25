---
id: comprehensions
track: python
level: Intermediate
module: Collections
title: Comprehensions
minutes: 16
keywords: comprehension, generator expression, walrus, unpacking
summary: A comprehension builds a list, set, or dict by looping in one expression. It creates its own scope for the loop variable.
---

```python
squares = [n * n for n in range(6)]
evens = [n for n in range(10) if n % 2 == 0]
labels = {n: n * n for n in range(4)}
initials = {name[0] for name in ["Ada", "Alan", "Grace"]}
print(squares)
print(evens)
print(labels)
print(initials)
```

The shape is `{expression for name in iterable if condition}`. The `if` is a filter. There is no `elif` inside a comprehension. Put complicated conditions in a function and call it.

A nested comprehension reads left to right, like nested loops:

```python
pairs = [(x, y) for x in range(2) for y in range(2)]
print(pairs)
```

## Generator expressions

```python
total = sum(n * n for n in range(10))
print(total)
```

Parentheses around a generator expression are optional when it is the only argument. It yields values one at a time and does not build a list. Use it when you only need to walk the values once.

## Scope

In modern Python the loop variable stays inside the comprehension. It does not leak into the surrounding function the way it did in very old versions. Do not write code that depends on the loop variable after the comprehension.

## The walrus operator, used sparingly

`:=` assigns inside an expression. In a comprehension it lets you use a computed value twice.

```python
rows = ["  ada ", "  ", " grace "]
clean = [name for raw in rows if (name := raw.strip())]
print(clean)
```

If the code needs two lines to be clear, use two lines. `:=` is for the cases where the alternative is computing the same thing twice.

## Unpacking in comprehensions (3.15)

Python 3.15 lets `*` and `**` unpack inside comprehensions.

```python
# groups = [[1, 2], [3, 4]]
# flat = [*group for group in groups]   # [1, 2, 3, 4]
# dicts = [{"a": 1}, {"b": 2}]
# merged = {**item for item in dicts}
```

`[*group for group in groups]` flattens one level. It replaces a nested comprehension or `itertools.chain.from_iterable`. Run it on Python 3.15. On older versions, write `[x for group in groups for x in group]`.

:::watch
A comprehension that builds a list of a million rows is a memory decision. If the next step is a single pass, use a generator expression. If you need random access later, the list is justified.
:::

:::try
From `words = ["Django", "a", "Python", "is"]`, build a list of the words that are longer than 2 characters, in lowercase.
:::

:::solution
```python
words = ["Django", "a", "Python", "is"]
print([word.lower() for word in words if len(word) > 2])
```
:::

:::quiz
What does a generator expression avoid, compared with a list comprehension?
+ Building the full list in memory before you start consuming values
- Naming the loop variable
- Filtering with if
because: A generator yields one value at a time. A list comprehension allocates every result first.
:::
