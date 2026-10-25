---
id: decorators
track: python
level: Intermediate
module: Intermediate Python
title: Decorators
minutes: 18
keywords: decorator, wraps, functools, closure
summary: A decorator is a function that takes a function and returns a function. The @ line is syntax for that call.
---

```python
import functools

def trace(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print("calling", func.__name__)
        return func(*args, **kwargs)
    return wrapper

@trace
def add(a, b):
    """Add two numbers."""
    return a + b

print(add(2, 3))
print(add.__name__, add.__doc__)
```

`@trace` above `def add` means `add = trace(add)` after the function is created. `trace` must return a callable. `functools.wraps` copies `__name__`, `__doc__`, and the signature information so the wrapper does not hide the original.

## Decorators with arguments

If the decorator itself needs a parameter, write a function that returns a decorator.

```python
import functools

def repeat(times):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            result = None
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(2)
def ping():
    print("ping")
    return "ok"

print(ping())
```

Read it inside out: `repeat(2)` returns `decorator`, and `@decorator` wraps `ping`.

## Where Django uses this

`@login_required` redirects anonymous users. `@require_POST` rejects GET. `@transaction.atomic` commits or rolls back the database work done in the view. `@task` in Django 6 registers a background task. They are all the same idea: run some policy around your function without editing every call site.

## Class-based decorators

Any object with `__call__` can be a decorator. Functions are enough until you need to store configuration as attributes. `functools.lru_cache` and `functools.cache` are decorators that memoize pure functions. Do not cache a function whose result depends on a database row that can change, unless you also know how to invalidate it.

:::watch
A decorator that does not return the wrapper's return value swallows the result. Always `return func(*args, **kwargs)` unless the decorator's job is to replace the result.
:::

:::try
Write a decorator `shout` that uppercases the string returned by the wrapped function. Use `functools.wraps`.
:::

:::solution
```python
import functools

def shout(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        return str(func(*args, **kwargs)).upper()
    return wrapper

@shout
def greet(name):
    return f"hello {name}"

print(greet("ada"))
```
:::

:::quiz
What does @trace placed above def add mean?
+ add = trace(add) after add is defined
- trace runs instead of add and add is deleted
- add is called immediately with no arguments
because: The @ syntax applies the decorator to the function object and rebinds the name to whatever the decorator returns.
:::
