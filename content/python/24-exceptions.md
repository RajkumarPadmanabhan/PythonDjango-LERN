---
id: exceptions
track: python
level: Beginner
module: Functions and files
title: Exceptions
minutes: 20
keywords: try, except, finally, raise, assert, Exception
summary: Exceptions are how Python reports failure. Catch the errors you can recover from, and let the rest crash with a traceback.
---

When something fails, Python raises an exception object and unwinds the call stack until a handler catches it. If nobody catches it, the program stops and prints a traceback.

```python
try:
    value = int("nope")
except ValueError as exc:
    print("not an integer:", exc)
```

## The shape of try

```python
def load(text):
    try:
        return int(text)
    except ValueError:
        return None
    finally:
        print("attempt finished")

print(load("12"))
print(load("no"))
```

`finally` runs whether the try block succeeded, failed, or returned. Use it to release a resource when a context manager is not available. `else` on `try` runs when the try block did **not** raise. It keeps the "success path" out of the `try`, so you do not accidentally catch an error from later code.

```python
try:
    number = int("12")
except ValueError:
    number = None
else:
    print("parsed", number)
```

## Catch narrowly

```python
data = {"a": "1"}
try:
    print(int(data["b"]))
except KeyError:
    print("missing key")
except ValueError:
    print("bad integer")
```

`except Exception` catches almost everything, including bugs you wanted to see. `except:` with no type also catches `KeyboardInterrupt` and `SystemExit`. Do not write a bare `except`. Catch `Exception` only at a boundary (a request handler, a worker loop) where you log and continue.

Since 3.11 you can group exceptions: `except (KeyError, ValueError) as exc`. Since 3.14 the parentheses can be omitted for a single group in some forms; keeping parentheses stays clear. `except*` is for exception groups raised by concurrent code. You can ignore it until you write asyncio task groups.

## raise

```python
def set_age(age):
    if age < 0:
        raise ValueError("age must be >= 0")
    return age
```

`raise` with no arguments, inside `except`, re-raises the current exception and keeps the traceback. `raise OtherError("context") from exc` chains the cause so the traceback shows both.

Define your own type when callers should catch a specific failure:

```python
class ConfigError(Exception):
    pass
```

Inherit from `Exception`, not from `BaseException`.

## assert

`assert condition, "message"` raises `AssertionError` if the condition is false. Python can strip asserts when run with `-O`. Use asserts for internal invariants in development and tests. Use `raise` for validating user input. Django forms and DRF serializers are the places user input is validated in a web app.

:::watch
This swallows a bug and continues with a bad value:

```python
try:
    do_everything()
except Exception:
    pass
```

Log the traceback (`logging.exception`) or let it propagate. A silent `pass` is how data gets half-saved.
:::

:::try
Write a function `parse_score(text)` that returns an int between 0 and 100. Raise `ValueError` if the text is not an integer or the number is out of range.
:::

:::solution
```python
def parse_score(text):
    score = int(text)
    if not 0 <= score <= 100:
        raise ValueError("score must be from 0 to 100")
    return score

print(parse_score("40"))
```
:::

:::quiz
What is finally for?
+ Code that must run whether the try block succeeded or raised
- Code that runs only when an exception was caught
- A replacement for else
because: finally is the cleanup path. It runs on success, on failure, and even when you return inside try.
:::
