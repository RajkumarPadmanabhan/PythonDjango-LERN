---
id: type-hints
track: python
level: Intermediate
module: Intermediate Python
title: Type hints
minutes: 16
keywords: typing, list, dict, Optional, Protocol, type
summary: Annotations document and check the shapes of values. Python does not enforce them while the program runs unless you add a checker.
---

```python
def greet(name: str, times: int = 1) -> str:
    return (name + " ") * times

print(greet("Ada", 2))
```

The program runs the same without the annotations. A type checker (`mypy`, `pyright`) reads them and reports mistakes before you run. Editors use them for completion.

Modern syntax, available directly on the Python versions Django 6 supports:

```python
def find(items: list[str], target: str) -> int | None:
    try:
        return items.index(target)
    except ValueError:
        return None
```

`list[str]`, `dict[str, int]`, and `int | None` do not need `from typing import List, Optional` on Python 3.9+ / 3.10+. Prefer the builtin forms.

`typing.Protocol` describes behavior without inheritance:

```python
from typing import Protocol

class Named(Protocol):
    name: str

def label(obj: Named) -> str:
    return obj.name
```

Any object with a `name` attribute satisfies `Named`. This matches how Python already works.

`type Vector = list[float]` (3.12+, soft keyword `type`) creates a type alias. On 3.14+, annotations are stored lazily and evaluated when a tool asks for them (PEP 649). Forward references usually no longer need quotes. `annotationlib.get_annotations` is the inspection API.

## What the checker cannot know

JSON from the network is `Any` until you validate it. A Django model field looks like the Python type you declared, but the value can still be wrong if you bypass the form and assign raw request data. Hints do not replace validation.

`TypedDict` describes a dict with known keys. `Literal["open", "done"]` is a closed set of values. `TypeGuard` and `TypeIs` narrow a type after a check. `Final` marks a name you do not rebind. You can learn those as you meet them in libraries.

:::watch
`def f(items: list = [])` still has the mutable-default bug. The annotation does not create a new list. Use `items: list[str] | None = None`.
:::

:::tip
Add hints at the boundaries: function arguments, return values, and dataclass fields. Hinting every local variable adds noise. Let the checker infer the middle.
:::

:::quiz
Does Python raise TypeError if you pass an int to a parameter annotated as str?
+ No. Annotations are not checked at runtime unless you add a tool that checks them
- Yes, always, since Python 3.10
- Only if you import typing
because: The interpreter stores annotations for tools and ignores them during ordinary calls. Validation is a separate step.
:::
