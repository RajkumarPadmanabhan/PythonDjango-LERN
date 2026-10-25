---
id: inheritance
track: python
level: Intermediate
module: Objects
title: Inheritance and polymorphism
minutes: 16
keywords: inheritance, super, isinstance, override, MRO
summary: A subclass reuses and overrides behavior. super() follows the method resolution order, which is not always "the parent you named first."
---

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "..."

class Dog(Animal):
    def speak(self):
        return f"{self.name} says woof"

pet = Dog("Ada")
print(pet.speak())
print(isinstance(pet, Animal))
```

`Dog` inherits `Animal`'s initializer because it did not override `__init__`. `isinstance(pet, Animal)` is true. `type(pet) is Dog`. Prefer `isinstance` when you mean "supports this interface." Prefer duck typing — just call the method — when you do not need a strict hierarchy.

## super and cooperative init

```python
class Timestamped:
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        from datetime import datetime, timezone
        self.created = datetime.now(timezone.utc)

class Named:
    def __init__(self, name, **kwargs):
        super().__init__(**kwargs)
        self.name = name

class Record(Timestamped, Named):
    def __init__(self, name):
        super().__init__(name=name)

record = Record("note")
print(record.name, record.created.year)
```

`super()` does not mean "my first parent." It means "the next class in this instance's MRO." That is why each `__init__` accepts `**kwargs` and calls `super()`. Multiple inheritance works when every class cooperates. The MRO lesson shows the C3 order. Until then, prefer one parent.

## Abstract base classes

```python
from abc import ABC, abstractmethod

class Repository(ABC):
    @abstractmethod
    def get(self, key):
        raise NotImplementedError

class MemoryRepository(Repository):
    def __init__(self):
        self._data = {}

    def get(self, key):
        return self._data[key]
```

You cannot instantiate a class that still has abstract methods. ABC is a design tool, not a runtime security check.

Django's class-based views are a deep inheritance tree (`View`, `TemplateView`, `FormView`, `CreateView`). You override a small method (`get_queryset`, `form_valid`) and `super()` reaches the implementation you did not rewrite. Reading the MRO with `View.mro()` is a normal way to learn that tree.

:::watch
Overriding `__init__` and forgetting `super().__init__()` drops the parent's setup. On a Django model or form, that skips essential field machinery. If you override a model method that has a job, call `super()` unless you intend to replace the job entirely.
:::

:::quiz
What does super() call?
+ The next class in the instance's method resolution order
- Always the class written first in the parentheses
- The built-in object constructor only
because: super is cooperative. The MRO of the actual instance decides who is next, which matters with multiple inheritance.
:::
