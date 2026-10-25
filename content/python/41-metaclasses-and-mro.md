---
id: metaclasses-and-mro
track: python
level: Advanced
module: Advanced Python
title: Method resolution order and metaclasses
minutes: 16
keywords: MRO, C3, super, metaclass, type, __init_subclass__
summary: The MRO is the order Python searches parent classes. A metaclass builds the class. You rarely write one. You should be able to read one.
---

```python
class A:
    def ping(self):
        return "A"

class B(A):
    def ping(self):
        return "B"

class C(A):
    def ping(self):
        return "C"

class D(B, C):
    pass

print(D().ping())
print([cls.__name__ for cls in D.mro()])
```

`D().ping()` is `"B"`. The MRO is `D, B, C, A, object`. Python uses the C3 linearization so each parent keeps its local order and a class is not visited twice. If a consistent order does not exist, class creation raises `TypeError`. That error is a design problem, not something to silence.

`super()` continues from the class where the method was defined, along the instance's MRO. Inside `B.ping`, `super().ping()` would reach `C.ping` for an instance of `D`, not `A.ping`. Cooperative multiple inheritance depends on every class calling `super()`.

## What a class is

A class is an object. Its type is `type`, unless a metaclass says otherwise. `type(name, bases, namespace)` builds a class. A metaclass overrides that construction.

Django's `ModelBase` is a metaclass. It collects `Field` attributes into `_meta`, contributes managers, and wires the app registry. That is why field order and `class Meta` exist, and why you cannot treat a model class as an ordinary class created only to hold methods.

You almost never need your own metaclass. `__init_subclass__` covers many "register every subclass" problems:

```python
class Plugin:
    registry = []

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        Plugin.registry.append(cls)

class JsonPlugin(Plugin):
    pass

print(Plugin.registry[0].__name__)
```

Class decorators are the other lighter alternative. Reach for a metaclass when you are building a framework that must see the class body while the class is being created. Models need that. Most application code does not.

:::tip
When a Django method's `super()` does something unexpected, print `type(self).mro()` and find where your class sits. The next class after yours is what `super()` will enter for a method defined on your class.
:::

:::quiz
If class D(B, C) and both B and C define ping, whose ping runs on D()?
+ B, the first parent, if B is ahead of C in the MRO
- Both, in order
- A, the shared grandparent
because: Attribute lookup walks the MRO and stops at the first hit. With D(B, C), B comes before C.
:::
