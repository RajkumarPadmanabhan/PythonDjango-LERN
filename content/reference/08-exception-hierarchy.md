---
id: exception-hierarchy
track: reference
level: Reference
module: Language reference
title: Exception hierarchy
minutes: 12
keywords: BaseException, Exception, ValueError, TypeError, KeyError, OSError
summary: What inherits from what, so you catch the layer you mean.
---

`BaseException` is the root. Do not catch it. It includes exceptions that should usually stop the program.

| Type | Role |
| --- | --- |
| `BaseException` | Root |
| `SystemExit` | `sys.exit` |
| `KeyboardInterrupt` | Ctrl+C |
| `GeneratorExit` | A generator was closed |
| `Exception` | The root of errors you may catch |
| `StopIteration` | End of an iterator. Do not convert this into a normal return inside a generator. Since 3.7, that becomes a `RuntimeError` |
| `StopAsyncIteration` | End of an async iterator |
| `ArithmeticError` | `ZeroDivisionError`, `OverflowError`, `FloatingPointError` |
| `AssertionError` | A failed `assert` |
| `AttributeError` | Missing attribute |
| `BufferError` | Buffer contract broken |
| `EOFError` | `input` hit the end of the file |
| `ImportError`, `ModuleNotFoundError` | Import failed |
| `LookupError` | `IndexError`, `KeyError` |
| `MemoryError` | Out of memory |
| `NameError`, `UnboundLocalError` | Name not bound |
| `OSError` | Files, sockets, processes. Includes `FileNotFoundError`, `PermissionError`, `TimeoutError`, `ConnectionError` |
| `ReferenceError` | A weak reference is dead |
| `RuntimeError`, `NotImplementedError`, `RecursionError` | Runtime conditions |
| `SyntaxError`, `IndentationError`, `TabError` | The file did not compile |
| `SystemError` | The interpreter itself |
| `TypeError` | Wrong type |
| `ValueError` | Right type, wrong value. `UnicodeError` is a subclass |
| `Warning` | Warning categories, which are exceptions so filters can raise them |

Django adds `django.core.exceptions`: `ValidationError`, `ObjectDoesNotExist`, `PermissionDenied`, `SuspiciousOperation`, `FieldError`, `MultipleObjectsReturned`, and model `DoesNotExist` classes that inherit from `ObjectDoesNotExist`. `Http404` is the "turn this into a 404" signal. `SuspiciousOperation` subclasses become 400 responses so a bad request does not become a 500 page full of details.

`Model.NotUpdated` (Django 6) is raised when a forced update changes no row.

Catch the narrowest type that means "I know what to do." Let `Exception` reach your logging boundary.

:::quiz
Why not catch BaseException?
+ It includes KeyboardInterrupt and SystemExit, which you normally should not swallow
- It is an alias of Exception
- It cannot be caught
because: Exception is the root of recoverable errors. BaseException also covers process control.
:::
