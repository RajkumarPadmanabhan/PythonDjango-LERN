---
id: dunder-catalog
track: reference
level: Reference
module: Language reference
title: Dunder catalog
minutes: 14
keywords: dunder, __init__, __str__, __eq__, __enter__, __await__
summary: The special methods, grouped by the syntax that calls them.
---

You implement these. Python calls them. The everyday set is in the dunder lesson. This is the map.

## Creation and representation

`__init__` initializes. `__new__` allocates. You almost never override `__new__`. `__repr__` and `__str__` produce strings. `__format__` supports format specs. `__bytes__` supports `bytes(obj)`. `__hash__` and `__eq__` define dict-key behavior. `__bool__` defines truthiness.

## Attributes

`__getattr__` runs when ordinary lookup fails. `__getattribute__` runs on every lookup and is easy to break. `__setattr__` and `__delattr__` intercept assignment and deletion. `__dir__` customizes `dir()`. `__slots__` replaces the instance dict.

## Containers

`__len__`, `__length_hint__`, `__getitem__`, `__setitem__`, `__delitem__`, `__iter__`, `__reversed__`, `__contains__`, `__missing__` (dict subclasses).

## Callables and context

`__call__` makes an instance callable. `__enter__` and `__exit__` support `with`. `__aenter__` and `__aexit__` support `async with`.

## Numbers

`__add__`, `__sub__`, `__mul__`, `__truediv__`, `__floordiv__`, `__mod__`, `__pow__`, `__matmul__`, and the reflected forms (`__radd__`) when the left operand does not handle the operation. In-place forms are `__iadd__` and friends. `__neg__`, `__pos__`, `__abs__`, `__int__`, `__float__`, `__index__`, `__round__`.

## Comparison

`__lt__`, `__le__`, `__gt__`, `__ge__`. `functools.total_ordering` can fill these in from `__eq__` and one other. `__eq__` returning `NotImplemented` lets the other operand try.

## Descriptors and classes

`__get__`, `__set__`, `__delete__`, `__set_name__`. `__init_subclass__` sees subclasses. `__instancecheck__` and `__subclasscheck__` live on metaclasses. `__mro_entries__` is for generic alias tricks. `__class_getitem__` supports `list[int]`.

## Async and iteration

`__await__`, `__aiter__`, `__anext__`. A generator uses `__next__` and `send`.

## Pickle and copy

`__reduce__`, `__getstate__`, `__setstate__`, `__copy__`, `__deepcopy__`. Prefer not to pickle untrusted data at all.

Django models use a metaclass rather than asking you to write these. Your own value objects need `__repr__`, `__eq__`, and sometimes `__hash__`. Your own resources need `__enter__` and `__exit__`, or `@contextmanager`.

:::tip
If you define `__eq__` and want the object in a set, define `__hash__` from the same fields, and do not mutate those fields.
:::
