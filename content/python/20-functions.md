---
id: functions
track: python
level: Beginner
module: Functions and files
title: Functions
minutes: 18
keywords: def, return, parameter, argument, docstring
summary: A function is a named block that runs when you call it. return sends a value back and leaves the function.
---

```python
def greet(name, punctuation="!"):
    """Return a greeting. Do not print it."""
    return f"Hello, {name}{punctuation}"

print(greet("Ada"))
print(greet("Grace", "."))
```

`def` creates a function object and binds the name. The block does not run until the call. Parameters are the names in the definition. Arguments are the values you pass.

The string right under `def` is the docstring. `help(greet)` shows it. Write one sentence that says what the function returns or what side effect it has.

## return

`return` stops the function. With no value, the function returns `None`. Reaching the end of the function also returns `None`.

```python
def first_even(numbers):
    for n in numbers:
        if n % 2 == 0:
            return n
    return None

print(first_even([1, 3, 4, 6]))
print(first_even([1, 3]))
```

A function returns one object. That object can be a tuple, which the caller can unpack: `return low, high`.

## Arguments by position and by name

```python
def box(width, height, depth):
    return width * height * depth

print(box(2, 3, 4))
print(box(width=2, depth=4, height=3))
```

Keyword arguments can be in any order after the positional ones. A positional argument cannot follow a keyword argument.

## Pure functions and side effects

A pure function's result depends only on its arguments and it changes nothing else. `greet` above is pure. `list.append` is a side effect. Prefer returning data and letting the caller print it. Your functions become testable without capturing the screen.

:::why
Default arguments are evaluated once, when the function is defined, not on each call. A mutable default is shared by every caller.

```python
def add_item(item, bucket=[]):
    bucket.append(item)
    return bucket

print(add_item("a"))
print(add_item("b"))
```

The second call prints `['a', 'b']`. Use `None` as the default and create the list inside:

```python
def add_item(item, bucket=None):
    if bucket is None:
        bucket = []
    bucket.append(item)
    return bucket
```
:::

:::try
Write `clamp(n, low, high)` that returns `low` if `n` is smaller, `high` if `n` is larger, and `n` otherwise. Do not print inside the function.
:::

:::solution
```python
def clamp(n, low, high):
    if n < low:
        return low
    if n > high:
        return high
    return n

print(clamp(15, 0, 10))
print(clamp(4, 0, 10))
```
:::

:::quiz
Why is a list a dangerous default argument?
+ It is created once and shared by later calls, so appends accumulate
- Lists cannot be parameters
- The function cannot return a list
because: Defaults are bound at definition time. A mutable object then keeps every mutation.
:::
