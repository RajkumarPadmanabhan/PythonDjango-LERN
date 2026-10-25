---
id: context-managers
track: python
level: Intermediate
module: Intermediate Python
title: Context managers and with
minutes: 14
keywords: with, contextmanager, __enter__, __exit__, contextlib
summary: with guarantees cleanup. A context manager runs setup on entry and cleanup on exit, including when the block raises.
---

You already use `with` for files. The protocol is two methods. `__enter__` runs at the start and its return value is bound by `as`. `__exit__` runs at the end. If the block raised, `__exit__` receives the exception type, value, and traceback. If `__exit__` returns a true value, the exception is suppressed. Almost every `__exit__` should return `None` so errors stay visible.

```python
class Pushdir:
    def __init__(self, path):
        self.path = path
        self.previous = None

    def __enter__(self):
        import os
        self.previous = os.getcwd()
        os.chdir(self.path)
        return self.path

    def __exit__(self, exc_type, exc, tb):
        import os
        os.chdir(self.previous)

# with Pushdir("labs") as path:
#     print("now in", path)
```

## contextlib

```python
from contextlib import contextmanager

@contextmanager
def section(title):
    print("start", title)
    try:
        yield title
    finally:
        print("end", title)

with section("import") as name:
    print("working in", name)
```

The code before `yield` is `__enter__`. The code after `yield`, usually in `finally`, is `__exit__`. If you need to suppress an exception you must be explicit; do not let a bug disappear.

`contextlib.suppress(FileNotFoundError)` is a readable way to ignore one expected error. `contextlib.closing` calls `close` on objects that are not yet context managers.

Django's `transaction.atomic()` is a context manager. Leaving the block commits. An exception rolls the transaction back. You can also write `with transaction.atomic():` around a view's critical section.

## Several resources

```python
from pathlib import Path

source = Path("notes.txt")
source.write_text("data\n", encoding="utf-8")
with source.open(encoding="utf-8") as src, Path("copy.txt").open("w", encoding="utf-8") as dst:
    dst.write(src.read())
```

They exit in reverse order, like a stack.

:::quiz
If the with block raises and __exit__ returns None, what happens to the exception?
+ It propagates to the caller after cleanup
- It is always swallowed
- The program restarts the block
because: A false return from __exit__ means "I did not handle this." Cleanup still ran.
:::
