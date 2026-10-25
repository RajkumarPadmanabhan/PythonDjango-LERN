---
id: iterators-and-generators
track: python
level: Intermediate
module: Intermediate Python
title: Iterators and generators
minutes: 18
keywords: iter, next, yield, generator, StopIteration, yield from
summary: for loops use the iterator protocol. yield turns a function into a generator that produces values lazily.
---

```python
numbers = iter([10, 20])
print(next(numbers))
print(next(numbers))
```

A third `next` raises `StopIteration`. `for` catches that and stops. You rarely call `next` yourself. You write objects that participate in the protocol.

An **iterable** has `__iter__` and returns an iterator. An **iterator** has `__next__` and usually returns itself from `__iter__`.

## Generators

```python
def countdown(start):
    while start > 0:
        yield start
        start -= 1

print(list(countdown(3)))
```

Calling `countdown(3)` does not run the body. It returns a generator object. Each `next` runs until `yield`, sends that value out, and pauses. Local variables stay alive between yields. When the function returns, the generator raises `StopIteration`.

`yield from other` delegates to another iterable. It is the clean way to flatten one level or to wrap another generator.

## Generator expressions

`(n * n for n in range(5))` is a generator. Square brackets build a list. Parentheses build a generator. `sum(n * n for n in range(5))` never stores all the squares.

## What you may not do

A generator is single-pass. Once it is exhausted, it does not restart. Iterating a second time sees nothing. If you need two passes, convert to a list or call the generator function again.

You can `.send(value)` into a generator at a `yield` expression, and `.throw` or `.close`. Most application code only needs `yield`. Async generators use `async def` and `yield` together, covered with asyncio.

:::why
Django querysets are lazy for a related reason. Building the queryset object does not hit the database. Iterating it does. Generators teach the same habit: separate "describe the work" from "do the work."
:::

:::try
Write a generator `positives(numbers)` that yields only the numbers greater than zero. Consume it with `list`.
:::

:::solution
```python
def positives(numbers):
    for n in numbers:
        if n > 0:
            yield n

print(list(positives([-1, 4, 0, 2])))
```
:::

:::quiz
When does the body of a generator function run?
+ When the caller pulls the next value, not when the function is called
- Immediately, like a normal function, returning a list
- Only if you use return
because: Calling the function builds a generator object. Execution advances to the next yield on each next() call.
:::
