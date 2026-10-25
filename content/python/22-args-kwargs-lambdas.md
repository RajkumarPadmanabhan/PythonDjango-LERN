---
id: args-kwargs-lambdas
track: python
level: Intermediate
module: Functions and files
title: *args, **kwargs, lambdas, and call tricks
minutes: 16
keywords: args, kwargs, lambda, keyword-only, positional-only
summary: * gathers extra positional arguments. ** gathers extra keyword arguments. You can also force arguments to be positional-only or keyword-only.
---

```python
def total(*numbers):
    return sum(numbers)

def label(text, **attrs):
    pairs = " ".join(f'{key}="{value}"' for key, value in attrs.items())
    return f"<{text} {pairs}>"

print(total(1, 2, 3))
print(label("a", href="/", title="home"))
```

`*numbers` is a tuple of the extra positional arguments. `**attrs` is a dict of the extra keyword arguments. The names `args` and `kwargs` are convention, not syntax.

Unpacking at the call site uses the same stars:

```python
nums = [1, 2, 3]
print(total(*nums))
options = {"href": "/", "title": "home"}
print(label("a", **options))
```

## Positional-only and keyword-only

```python
def clip(text, /, limit, *, ellipsis="..."):
    if len(text) <= limit:
        return text
    return text[: limit - len(ellipsis)] + ellipsis

print(clip("Pathline course", 10))
print(clip("Pathline course", limit=10, ellipsis="…"))
```

Parameters before `/` can only be passed by position. Parameters after `*` can only be passed by keyword. This lets you rename a positional parameter later without breaking callers, and it forces meaningful names on flags that would be mysterious as bare `True`.

## lambda

`lambda parameters: expression` is a function with a single expression and no statements. Use it for a short key.

```python
names = ["ada", "Grace", "linus"]
print(sorted(names, key=lambda name: name.lower()))
```

If the function needs a name, a docstring, or more than one line, write `def`.

## Recursion, briefly

A function may call itself. It needs a base case that does not recurse.

```python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))
```

Python does not optimize tail calls. Deep recursion hits `RecursionError`. Loops are the normal tool. Recursion fits trees: nested comments, file directories, HTML-like structures.

:::tip
When you write a wrapper, accept `*args, **kwargs` and pass them on, so the wrapper does not hide the wrapped function's signature. `functools.wraps` copies the name and docstring. Decorators are the next lesson.
:::

:::quiz
What type is the name after a single star in def total(*numbers)?
+ A tuple of positional arguments
- A list
- A dict
because: * gathers positions into a tuple. ** gathers keywords into a dict.
:::
