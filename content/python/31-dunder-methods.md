---
id: dunder-methods
track: python
level: Intermediate
module: Objects
title: Dunder methods
minutes: 18
keywords: __str__, __repr__, __eq__, __len__, __getitem__, __bool__
summary: Special methods let your objects participate in Python syntax. The catalog lesson lists them. These are the ones you will write.
---

Dunder methods (double underscore) are hooks. Python calls `task.__len__()` when you write `len(task)`. You define the hook. You do not call it yourself in normal code; you use the built-in or the operator.

```python
class Money:
    def __init__(self, cents):
        self.cents = int(cents)

    def __repr__(self):
        return f"Money({self.cents})"

    def __str__(self):
        return f"${self.cents / 100:.2f}"

    def __eq__(self, other):
        if not isinstance(other, Money):
            return NotImplemented
        return self.cents == other.cents

    def __add__(self, other):
        if not isinstance(other, Money):
            return NotImplemented
        return Money(self.cents + other.cents)

    def __hash__(self):
        return hash(self.cents)

print(Money(250))
print(repr(Money(250)))
print(Money(100) + Money(50) == Money(150))
```

`__repr__` is for developers and should be unambiguous. `__str__` is for users. f-strings and `print` use `__str__`. The REPL and tracebacks use `__repr__`. If you write only one, write `__repr__`; `__str__` falls back to it.

Returning `NotImplemented` from a comparison or arithmetic method lets Python try the other operand's method. Returning `False` would claim the comparison succeeded in meaning "not equal" and block that fallback.

If you define `__eq__`, Python sets `__hash__` to `None` and the object becomes unhashable, unless you define `__hash__` too. Hashable objects must not change the fields that participate in equality while they are in a set or dict.

## Containers

```python
class Deck:
    def __init__(self, cards):
        self.cards = list(cards)

    def __len__(self):
        return len(self.cards)

    def __getitem__(self, index):
        return self.cards[index]

    def __iter__(self):
        return iter(self.cards)

deck = Deck(["a", "b", "c"])
print(len(deck), deck[0], list(deck))
```

`__bool__` customizes truthiness. If it is missing, Python uses `__len__`. An empty deck is false if `__len__` returns 0.

`__enter__` and `__exit__` make a class a context manager. `__call__` lets an instance be called like a function. Django form validators and middleware classes use that pattern.

The full catalog, including numeric and async hooks, is in the dunder reference.

:::watch
Do not invent dunder names (`__data__`). Python reserves that pattern. Use a normal attribute or a single underscore.
:::

:::quiz
Which method does print() use first?
+ __str__, falling back to __repr__
- __repr__ only
- __format__ only
because: print and str() look for __str__. The debugger and repr() look for __repr__.
:::
