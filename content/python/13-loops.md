---
id: loops
track: python
level: Beginner
module: Control flow
title: for and while loops
minutes: 16
keywords: for, while, range, enumerate, zip, iter
summary: for walks an iterable. while repeats as long as a condition stays true. range produces indexes on demand.
---

`for name in iterable` asks the iterable for an iterator and binds `name` to each yielded item.

```python
for letter in "Ada":
    print(letter)

for n in range(3):
    print(n)
```

`range(stop)` yields `0, 1, ..., stop-1`. `range(start, stop, step)` lets you set the start and the step. `range` does not build a list. It produces numbers as you ask for them. `list(range(5))` is how you force the list, and you rarely need to.

## enumerate and zip

```python
names = ["Ada", "Grace"]
for index, name in enumerate(names, start=1):
    print(index, name)

scores = [10, 9]
for name, score in zip(names, scores, strict=True):
    print(name, score)
```

`enumerate` pairs each item with a counter so you do not write `range(len(...))`. `zip` walks several iterables in step. `strict=True` (3.10+) raises if the lengths differ. Without it, `zip` stops at the shortest.

## while

```python
n = 3
while n > 0:
    print(n)
    n -= 1
print("go")
```

Use `while` when there is no collection to walk: retry a download, read until a sentinel, wait for a condition. Every `while` needs a step that moves toward the condition becoming false. If nothing changes, the loop never ends. Ctrl+C raises `KeyboardInterrupt` and stops it.

:::why
A `for` loop is not special syntax for lists. It uses the iterator protocol. `for` calls `iter(obj)`, then calls `next` on that iterator until `StopIteration`. Strings, files, Django querysets, and generators all work in `for` because they implement that protocol. The iterators lesson shows you how to write one.
:::

## Looping over dictionaries

```python
person = {"name": "Ada", "city": "London"}
for key in person:
    print(key, person[key])
for key, value in person.items():
    print(key, value)
```

Looping over a dict yields keys. `items()` yields pairs. Do not add or remove keys while you loop over a dict. Loop over a copy (`list(person)`) if you must change the size.

:::watch
```python
for n in range(3):
    print(n)
    n = 0
```
Assigning to `n` does not reset the loop. The next value comes from the range iterator, not from the variable. To change a while-loop counter you assign to the name the condition reads. To change what a for-loop does, change the iterable or use `break`.
:::

:::try
Print the squares of the numbers 1 through 5, one per line, using `range`.
:::

:::solution
```python
for n in range(1, 6):
    print(n * n)
```
:::

:::quiz
What values does range(1, 5) produce?
+ 1, 2, 3, 4
- 1, 2, 3, 4, 5
- 0, 1, 2, 3, 4
because: The stop value is excluded, and the start is 1, so 5 is not included and 0 is not the start.
:::
