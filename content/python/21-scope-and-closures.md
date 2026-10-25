---
id: scope-and-closures
track: python
level: Intermediate
module: Functions and files
title: Scope, closures, and late binding
minutes: 18
keywords: LEGB, global, nonlocal, closure, free variable
summary: Names are looked up locally, then in enclosing functions, then the module, then builtins. Closures capture variables, not the value they had at definition time.
---

Python looks up a name in four places, in order. The mnemonic is LEGB.

| Layer | Where |
| --- | --- |
| Local | The function currently running |
| Enclosing | An outer function, if this function is nested |
| Global | The module |
| Built-in | `len`, `print`, `str`, and the rest |

```python
count = 0

def show():
    print(count)

show()
```

`show` reads the module global because it does not assign to `count`. Assignment is the signal that a name is local.

```python
count = 0

def broken():
    count = count + 1  # UnboundLocalError

def working():
    global count
    count = count + 1

working()
print(count)
```

If any assignment to `count` appears in the function, `count` is local for the entire function. The right side of `count = count + 1` then reads the local before it exists. `global` says the assignment should rebind the module name. Use it rarely. Returning the new value is cleaner.

## nonlocal

```python
def counter():
    value = 0

    def increment():
        nonlocal value
        value += 1
        return value

    return increment

tick = counter()
print(tick(), tick(), tick())
```

`nonlocal` assigns to the nearest enclosing function scope. It does not reach the module. That is how a nested function keeps private state.

## Closures bind names, not snapshots

```python
functions = []
for n in range(3):
    functions.append(lambda: n)
print([fn() for fn in functions])
```

You might expect `[0, 1, 2]`. You get `[2, 2, 2]`. Each lambda looks up `n` when it is called, and the loop has finished with `n == 2`. Bind the current value as a default argument, which is evaluated at definition:

```python
functions = []
for n in range(3):
    functions.append(lambda n=n: n)
print([fn() for fn in functions])
```

:::why
A closure stores a reference to the cell that holds the variable, not a copy of the object that was there. That is the same name-binding rule as the rest of Python. Defaults work around it because default expressions run when `def` or `lambda` is evaluated.
:::

:::watch
`global` inside a Django view is a bug waiting for two requests. Request state belongs in the request, the session, or the database, not in a module global that every visitor shares.
:::

:::quiz
What does a loop of lambdas that read the loop variable usually see when called later?
+ The final value of that variable
- Each lambda's own copied number
- A SyntaxError
because: The lambda looks up the name at call time. The loop left that name bound to the last value. A default argument captures the value at definition.
:::
