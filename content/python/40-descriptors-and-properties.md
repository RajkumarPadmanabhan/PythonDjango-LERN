---
id: descriptors-and-properties
track: python
level: Advanced
module: Advanced Python
title: Properties and descriptors
minutes: 16
keywords: property, descriptor, __get__, __set__, classmethod
summary: A descriptor is an object on a class that runs code when you read or write an attribute. Functions, properties, and Django fields are descriptors.
---

`property` is the descriptor you will write most often.

```python
class Account:
    def __init__(self, balance):
        self._balance = 0
        self.balance = balance

    @property
    def balance(self):
        return self._balance

    @balance.setter
    def balance(self, value):
        if value < 0:
            raise ValueError("negative balance")
        self._balance = value

account = Account(10)
print(account.balance)
```

Reading `account.balance` calls the getter. Assigning calls the setter. Deleting can call a deleter. The underscore attribute holds the raw value so the setter does not call itself.

## The protocol

A descriptor implements `__get__(self, instance, owner)`, and maybe `__set__` and `__delete__`. If it implements `__set__` or `__delete__`, it is a data descriptor and it wins over an instance dictionary entry. Functions are non-data descriptors: `__get__` returns a bound method when you look them up on an instance.

That is the hidden logic of methods. `Task.complete` is a function. `task.complete` is a bound method because the function's `__get__` inserted `self`. `classmethod` and `staticmethod` are descriptors that bind differently.

```python
class Reveal:
    def __get__(self, instance, owner):
        if instance is None:
            return self
        return f"on {instance.label}"

class Row:
    label = "row"
    reveal = Reveal()

print(Row().reveal)
```

Django model fields are data descriptors. `task.title` on a class is the field object. `task.title` on an instance loads the value, and may hit the database if the column was deferred. That is why a field and a method must not share a name, and why `title` on a model is not "just a variable."

## When to use which

| Need | Tool |
| --- | --- |
| Validate or compute one attribute | `property` |
| Reuse the same behavior on many attributes | A descriptor class |
| A stored column | A Django field, which is already a descriptor |
| A one-off helper | A normal method |

:::watch
A property that queries the database or calls the network surprises anyone who thought attribute access was cheap. Name it like an action, or cache it deliberately and document the invalidation.
:::

:::quiz
Why does task.complete insert self automatically?
+ The function is a descriptor. Looking it up on an instance calls __get__ and returns a bound method
- The class copies the function into each instance at init
- self is a keyword
because: Method binding is the descriptor protocol, not a special case buried only in def.
:::
