---
id: keyword-reference
track: reference
level: Reference
module: Language reference
title: Every Python keyword
minutes: 25
keywords: keyword, False, None, True, and, as, assert, async, await, break, class, continue, def, del, elif, else, except, finally, for, from, global, if, import, in, is, lambda, nonlocal, not, or, pass, raise, return, try, while, with, yield, match, case, type, lazy
summary: Each hard keyword and each soft keyword, with the job it does and a minimal example.
---

Hard keywords cannot be used as names. Soft keywords are keywords only in a specific statement.

## Hard keywords

`False` and `True` are the boolean objects. `None` is the single null object. Test it with `is`.

`and`, `or`, and `not` combine truth values. `and` and `or` return operands and short-circuit. `not` returns a bool.

`if`, `elif`, and `else` choose a block. `else` also pairs with `for`, `while`, and `try`. On a loop it means "no `break`." On `try` it means "no exception."

`for` iterates. `while` repeats while a condition is true. `break` leaves the innermost loop. `continue` skips to the next item. `pass` is an empty statement.

`in` tests membership (`x in items`) and appears in `for x in items`.

`is` tests identity. Use it for `None` and sentinels. Use `==` for values.

`def` defines a function. `return` leaves it with a value, or with `None`. `lambda` is a one-expression function. `yield` pauses a generator and produces a value. `yield from` delegates to another iterable.

`class` defines a class.

`import` loads a module. `from` imports names from a module. `as` renames an import, a context manager (`with open(...) as handle`), or an exception (`except ValueError as exc`).

`try`, `except`, `finally`, `raise`, and `assert` handle errors. `raise` without arguments re-raises. `assert` can be stripped with `-O`. Do not use it for user input.

`with` enters a context manager and guarantees `__exit__`.

`global` assigns to a module-level name from inside a function. `nonlocal` assigns to an enclosing function's name. `del` unbinds a name or deletes an item (`del items[0]`).

`async` marks a coroutine function or an async comprehension. `await` pauses until an awaitable completes. Both are hard keywords.

## Soft keywords

`match` and `case` form structural pattern matching. Elsewhere, `match = 1` is legal.

`type` starts a type-alias statement (`type Vector = list[float]`) on Python 3.12+. `type(obj)` as a call remains the builtin.

`_` in a pattern matches anything and binds nothing. As a normal name it is a convention for "unused." It is not a hard keyword.

`lazy` on Python 3.15 marks a module-level import as deferred: `lazy import json`. It is a syntax error inside a function, class, or `try`. Elsewhere the name `lazy` can still be a variable.

## A compact example of the ones that are easy to forget

```python
def classify(numbers):
    found = None
    try:
        for n in numbers:
            if n is None:
                continue
            if n < 0:
                raise ValueError("negative")
            if n % 2 == 0:
                found = n
                break
        else:
            return None
    except ValueError as exc:
        return str(exc)
    finally:
        pass
    return found

print(classify([1, 3, 4, 7]))
```

```python
command = "quit"
match command:
    case "quit" | "exit":
        label = "stop"
    case other:
        label = other
print(label)
```

## Names that are not keywords and still bite

Do not assign to `list`, `dict`, `set`, `str`, `int`, `id`, `sum`, `min`, `max`, `input`, `len`, `file`, `type`, or `filter`. You hide the builtin in that scope.

:::quiz
Which word is a soft keyword?
+ match
- return
- class
because: match is only special in a match statement. return and class are always keywords.
:::
