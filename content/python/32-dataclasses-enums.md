---
id: dataclasses-enums
track: python
level: Intermediate
module: Objects
title: Dataclasses, enums, and slots
minutes: 14
keywords: dataclass, enum, slots, field, frozen
summary: A dataclass writes the boilerplate for a record. An enum names a fixed set of values. slots drops the per-instance dict.
---

```python
from dataclasses import dataclass, field

@dataclass(frozen=True, slots=True)
class Point:
    x: float
    y: float
    tags: list[str] = field(default_factory=list)

    def magnitude(self):
        return (self.x ** 2 + self.y ** 2) ** 0.5

p = Point(3, 4)
print(p, p.magnitude())
```

`@dataclass` generates `__init__`, `__repr__`, and `__eq__` from the annotations. `frozen=True` makes assignment after init raise `FrozenInstanceError` and, when the fields are hashable, generates `__hash__`. `slots=True` stores attributes in a fixed layout instead of `__dict__`, which uses less memory and rejects accidental new attributes.

`field(default_factory=list)` builds a new list per instance. A bare `tags: list[str] = []` is rejected, because it would share one list.

`order=True` adds comparison methods based on the field order. Use it only when that order is meaningful.

## Enums

```python
from enum import Enum, auto

class Status(Enum):
    OPEN = auto()
    DONE = auto()

print(Status.OPEN.name, Status.OPEN.value)
print(Status.OPEN is Status.OPEN)
```

Enums are the right model for a closed set of choices. Compare with `is` or `==`. Django fields often store the enum value (`TextChoices` and `IntegerChoices` are Django's version of this idea, integrated with migrations).

## When not to use a dataclass

Use a normal class when the object is an entity with identity and a changing lifecycle, especially a Django model. Models already have a metaclass and a field system. Do not also decorate them as dataclasses. Use a `namedtuple` only for a tiny immutable record you want to unpack by position.

:::tip
A dataclass is an excellent DTO: the object you pass into a service function so the function does not take twelve loose arguments. Validate in `__post_init__` if a combination of fields can be illegal.
:::

:::quiz
Why does a dataclass reject tags: list = [] as a default?
+ The list would be shared by every instance
- Lists cannot be type-hinted
- frozen forbids lists
because: Defaults are created once. default_factory is called per instance, which is what a mutable field needs.
:::
