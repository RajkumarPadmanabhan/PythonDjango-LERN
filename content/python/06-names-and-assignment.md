---
id: names-and-assignment
track: python
level: Beginner
module: Data
title: Names and assignment
minutes: 20
keywords: assignment, binding, object, variable, reference
summary: A variable is a name bound to an object. Assignment never copies the object unless you ask it to.
---

People say a variable is a box that holds a value. That picture is wrong in Python, and it causes the aliasing bugs you will meet later. The accurate picture is smaller and more useful.

An **object** is a thing in memory: an integer, a string, a list, a function, a Django model. A **name** is a label in a namespace that refers to an object. Assignment attaches a name to an object. It does not copy the object.

```python
score = 10
other = score
print(score, other)
```

`score` and `other` are two names for the same integer object `10`. Integers cannot be changed, so the sharing is invisible. Lists can be changed, and the sharing becomes visible:

```python
first = [1, 2]
second = first
second.append(3)
print(first)
```

`first` prints `[1, 2, 3]`. `append` changed the one list both names refer to. `second = first` did not copy.

:::why
The statement `second = first` looks up the object bound to `first` and binds `second` to that same object. There is no copy step. Copying is a separate, explicit operation: `second = first.copy()` for a shallow copy of a list, or `copy.deepcopy` when the list contains other lists.
:::

## Legal names

A name starts with a letter or underscore, then letters, digits, or underscores. Unicode letters are allowed. Names are case-sensitive. `Name` and `name` are different.

By convention (PEP 8):

| Style | Used for |
| --- | --- |
| `snake_case` | Functions, variables, modules, methods |
| `CapWords` | Classes |
| `UPPER_SNAKE` | Constants you promise not to rebind |
| `_leading` | Internal to a module. Not a security boundary |
| `__dunder__` | Names Python reserves for protocols |

## Multiple assignment

```python
x = y = 0
a, b = 1, 2
a, b = b, a
print(a, b)
```

The right side of `a, b = b, a` is fully evaluated first, into the tuple `(b, a)`, and then the names are bound. That is why the swap works without a temporary variable.

You can also annotate a name. The annotation is for readers and type checkers. At runtime, on modern Python, it does not by itself force the type:

```python
age: int = 30
print(age)
```

## Rebinding versus mutating

```python
items = [1]
items.append(2)   # mutate the object
items = [1, 2, 3] # rebind the name to a new object
```

`append` changes the list. The second line throws away the old binding and points `items` at a different list. Functions that receive a list and append to it change the caller's list. Functions that rebind their parameter do not change the caller's name. Scope is the next place this shows up; the mutability lesson goes deeper.

:::watch
`=` is assignment. `==` is comparison. They are not interchangeable. `if x = 1` is a syntax error in Python (the walrus `:=` is the rare form that assigns inside an expression, and you should not use it to "fix" a comparison).
:::

:::try
Bind `colors` to a list of two strings. Bind `alias` to `colors`. Append a third string through `alias`. Print `colors`. Then bind `alias` to a new list and show that `colors` did not change.
:::

:::solution
```python
colors = ["red", "blue"]
alias = colors
alias.append("green")
print(colors)
alias = ["white"]
print(colors)
print(alias)
```
:::

:::quiz
After `b = a` where `a` is a list, what does `b.append(1)` do to `a`?
+ It changes the same list, so `a` shows the new item
- It copies the list first, so `a` is unchanged
- It is a syntax error
because: Assignment binds another name to the same object. append mutates that object.
:::
