---
id: project-calculator
track: project
level: Beginner
module: Beginner Python
title: Project — four-function calculator
minutes: 22
keywords: decimal, operator, ZeroDivisionError, project
summary: A calculator that uses Decimal, rejects division by zero, and keeps going until the user quits.
---

Build a calculator that reads `12.5 + 3`, prints the result, and waits for another line. Support `+`, `-`, `*`, and `/`. Quit on `q`.

Concepts: `str.split`, `Decimal`, a dict of functions, exceptions.

File: `labs/projects/calculator.py`.

## The rule that matters

Money-style input should not use `float`. `Decimal("0.1")` is one tenth. `Decimal(0.1)` is not. Read the operand strings and pass those strings to `Decimal`.

```python
from decimal import Decimal, InvalidOperation

OPERATIONS = {
    "+": lambda a, b: a + b,
    "-": lambda a, b: a - b,
    "*": lambda a, b: a * b,
    "/": lambda a, b: a / b,
}

def evaluate(expression):
    parts = expression.split()
    if len(parts) != 3:
        raise ValueError("Use the form: 2 + 2")
    left, op, right = parts
    if op not in OPERATIONS:
        raise ValueError("Operator must be + - * or /")
    try:
        result = OPERATIONS[op](Decimal(left), Decimal(right))
    except InvalidOperation as exc:
        raise ValueError("Both sides must be numbers") from exc
    except ZeroDivisionError as exc:
        raise ValueError("Cannot divide by zero") from exc
    return result
```

The dict maps a symbol to a function. Adding a new operator is one new entry, not a new `elif` buried in the loop. That is the first design trick in this track.

## The loop

```python
def main():
    print("Enter things like 2 + 2. q quits.")
    while True:
        line = input("> ").strip()
        if line.casefold() in {"q", "quit"}:
            break
        try:
            print(evaluate(line))
        except ValueError as exc:
            print(exc)
```

`evaluate` does not print. `main` prints. You can test every error message by calling `evaluate`.

:::try
Support a unary form `neg 5` that returns `-5`, without breaking `2 + 2`.
:::

:::solution
If the line has two parts and the first is `neg`, return `-Decimal(second)`. Keep the three-part path for the four operations. Reject anything else with the same `ValueError` style.
:::

:::quiz
Why store operators in a dict of functions?
+ Each symbol looks up the operation, so the loop does not grow an elif chain
- Dictionaries are faster at arithmetic than + 
- Decimal requires a dict
because: The loop stays "parse, look up, call." New operations are data, not new branches.
:::
