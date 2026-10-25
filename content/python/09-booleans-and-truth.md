---
id: booleans-and-truth
track: python
level: Beginner
module: Data
title: Booleans, comparisons, and truth
minutes: 16
keywords: bool, and, or, not, truthiness, comparison
summary: True and False are objects. Conditions also accept other objects, using a defined truth test. and and or return operands, not always booleans.
---

`True` and `False` are the only two boolean objects. Comparisons and membership tests produce them.

```python
print(3 > 1)
print(3 == 3.0)
print(3 != 4)
print("a" < "b")
print(1 <= 2 <= 5)
```

Chained comparisons are `and` in disguise: `1 <= 2 <= 5` means `1 <= 2 and 2 <= 5`, and the middle expression is evaluated once.

## and, or, not

`not` returns a real boolean. `and` and `or` return one of their operands, using short-circuit evaluation.

```python
print(0 or 5)
print(5 and 0)
print("hi" and "there")
print(not "")
name = ""
print(name or "anonymous")
```

`or` returns the first operand that is true, otherwise the last. `and` returns the first operand that is false, otherwise the last. This is why `name or "anonymous"` is a default for empty strings. It is also why you should not write `if value == True` when you mean `if value`.

:::why
Short-circuit means the second operand is skipped when the first already decides the result. `False and expensive()` does not call `expensive`. `True or expensive()` does not either. People rely on this to guard lookups: `user is not None and user.is_active`.
:::

## Truthiness

In an `if` or `while`, Python asks the object whether it should count as true.

| Falsey | Examples |
| --- | --- |
| Constants | `None`, `False` |
| Numbers | `0`, `0.0`, `0j`, `Decimal(0)` |
| Empty collections | `""`, `[]`, `()`, `{}`, `set()`, empty range |
| Custom | Objects whose `__bool__` returns False, or whose `__len__` returns 0 |

Everything else is true, including `"0"`, `"False"`, `[0]`, and any non-empty Django queryset (be careful: a queryset's truth value runs a query).

```python
if "0":
    print("a non-empty string is true, even though it looks like zero")
```

:::watch
`if items:` is false for an empty list, which is usually what you want. `if items is not None:` is a different test: it accepts an empty list. Pick the one you mean. In Django, `if queryset:` can hit the database. Prefer `queryset.exists()` when you only need a yes or no and you might not iterate.
:::

## Identity of the booleans

`True` is `1` in a numeric context because `bool` is a subclass of `int`. `True + True` is `2`. `True == 1` is true. `True is 1` is false. Use booleans as booleans, not as numbers, except when a library documents that it wants a 0/1 flag.

:::quiz
What does `"" or "guest"` evaluate to?
+ "guest"
- False
- ""
because: or returns the first true operand. An empty string is falsey, so the result is the second operand itself, not the boolean True.
:::
