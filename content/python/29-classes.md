---
id: classes
track: python
level: Intermediate
module: Objects
title: Classes and objects
minutes: 22
keywords: class, self, __init__, attribute, instance, method
summary: A class is a factory for objects that share behavior. self is the instance the method was called on.
---

```python
class Task:
    """A unit of work with a title and a done flag."""

    def __init__(self, title):
        self.title = title
        self.done = False

    def complete(self):
        self.done = True

    def label(self):
        mark = "x" if self.done else " "
        return f"[{mark}] {self.title}"

task = Task("write tests")
task.complete()
print(task.label())
```

`class Task` creates a class object. `Task("write tests")` calls `Task.__init__` after creating an empty instance, and returns that instance. You do not write a `new` keyword.

`self` is an ordinary parameter. Python passes the instance because you called `task.complete()`, which is `Task.complete(task)`. Naming it `self` is convention, not syntax. Stick to the convention.

## Instance data versus class data

```python
class Counter:
    created = 0

    def __init__(self):
        Counter.created += 1
        self.value = 0

a = Counter()
b = Counter()
print(Counter.created, a.value)
```

`created` lives on the class and is shared. `value` lives on the instance. A list defined on the class is shared too, which is the mutable-default bug in a new costume:

```python
class Bag:
    items = []  # one list for every Bag

    def add(self, item):
        self.items.append(item)
```

Put mutable defaults on `self` inside `__init__`.

## Methods

A function defined in the class body is a function. Accessing it through an instance produces a bound method that inserts `self`. `@classmethod` receives the class. `@staticmethod` receives neither, and is just a function parked in the class namespace. `@classmethod` is the one you use for alternate constructors:

```python
class Color:
    def __init__(self, r, g, b):
        self.r, self.g, self.b = r, g, b

    @classmethod
    def grey(cls, level):
        return cls(level, level, level)

print(Color.grey(10).r)
```

`cls` might be a subclass, so `cls(...)` builds the subclass rather than hard-coding `Color`.

## Encapsulation is by agreement

A single leading underscore (`_cache`) means internal. A double leading underscore (`__cache`) mangles the name to `_ClassName__cache` so subclasses do not clash. It is not a security feature. Anyone can still read `task.title`.

Django models are classes. Fields you declare become descriptors that load database values. The class lesson is why `task.title` can look like a simple attribute and still run code. Descriptors are a later lesson.

:::try
Write a class `Counter` with `value` starting at 0, a method `inc` that adds 1, and a method `reset`. Show two counters that do not share `value`.
:::

:::solution
```python
class Counter:
    def __init__(self):
        self.value = 0

    def inc(self):
        self.value += 1

    def reset(self):
        self.value = 0

a = Counter()
b = Counter()
a.inc()
print(a.value, b.value)
```
:::

:::quiz
Where should a per-instance list be created?
+ On self inside __init__
- As a class attribute so it is shared on purpose, unless sharing is the goal
- As a global
because: A list on the class is one object. Instances that append to it are sharing. Create a new list in __init__ when each object needs its own.
:::
