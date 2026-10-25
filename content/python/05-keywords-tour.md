---
id: keywords-tour
track: python
level: Beginner
module: Start here
title: Keywords, the reserved words
minutes: 14
keywords: keyword, soft keyword, False, None, True
summary: Keywords are words Python keeps for grammar. You cannot use them as names.
---

A keyword is a word that already has a job in the grammar. You will learn each one in the lesson where it does work. This page is the map, so you can see the whole language in one place. The reference lesson repeats them with a short example each.

## Hard keywords

These are always keywords. Using one as a variable name is a syntax error.

| Keyword | Job |
| --- | --- |
| `False`, `True`, `None` | The two booleans and the null object |
| `and`, `or`, `not` | Logic |
| `if`, `elif`, `else` | Choices |
| `for`, `while`, `break`, `continue` | Loops |
| `in` | Membership, and the loop form `for x in items` |
| `is` | Identity, not equality |
| `def`, `return`, `lambda`, `yield` | Functions and generators |
| `class` | Types you define |
| `import`, `from`, `as` | Modules |
| `try`, `except`, `finally`, `raise`, `assert` | Errors |
| `with` | Context managers |
| `pass` | An empty block that is still valid syntax |
| `global`, `nonlocal` | Assign to a name in an outer scope |
| `del` | Unbind a name, or delete an item |
| `async`, `await` | Coroutines |

```python
True_value = True
print(True_value)
```

`True_value` is a legal name. `True` is not available as a name.

## Soft keywords

A soft keyword is a keyword only in a specific statement. Elsewhere it can be a normal name. That keeps old programs working.

| Word | Where it is special |
| --- | --- |
| `match`, `case` | Structural pattern matching (`match` / `case`) |
| `type` | The type-alias statement `type Vector = list[float]`, introduced in 3.12. `type(x)` as a function call still works |
| `_` | Often means "I will not use this value." It is not fully reserved, but pattern matching treats `_` as a wildcard |
| `lazy` | Python 3.15. `lazy import json` defers loading. In other positions `lazy` can still be a name |

```py
kind = "match"  # legal: match is not a hard keyword
print(kind)
```

## Names you should still avoid

These are not keywords, but they are built-in functions. If you bind them, you hide the original in that scope.

`list`, `dict`, `set`, `str`, `int`, `id`, `type`, `input`, `sum`, `min`, `max`, `file`, `len`.

```python
scores = [1, 2, 3]
print(len(scores))
```

:::watch
`list = [1, 2, 3]` makes the name `list` point at that list. Later in the same scope, `list("abc")` tries to call your list, not the built-in, and fails. Pick `items` or `names` instead.
:::

:::why
Keywords are recognized before names are looked up. That is why a keyword cannot store a value: it never becomes a name. Soft keywords are recognized only when the parser is in the matching statement, which is why `match = 1` can still be an assignment.
:::

The full write-up with an example for every keyword is in the keyword reference, near the end of the sidebar.

:::quiz
Why is `for = 3` illegal?
+ `for` is a hard keyword, reserved for loops
- `for` is a built-in function you must call
- Numbers cannot be assigned
because: Hard keywords never become names. The parser treats `for` as the start of loop syntax.
:::
