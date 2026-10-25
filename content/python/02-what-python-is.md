---
id: what-python-is
track: python
level: Beginner
module: Start here
title: What Python is
minutes: 12
keywords: interpreter, syntax, statement, expression, program
summary: A program is a precise list of instructions. Python reads that list and does it.
---

A program is text that tells the computer what to do, in an order, with rules strict enough that a machine can follow them. Python is one such set of rules. You write the text. The Python interpreter reads it and carries the instructions out.

## A first program

```python
print("Pathline")
print(2 + 3)
```

`print` sends a value to the screen. The quotes make `Pathline` text. `2 + 3` is math, so the second line shows `5`, not the characters `2 + 3`.

## Statements and expressions

An **expression** produces a value: `2 + 3`, `"Pathline"`, `len("hi")`.

A **statement** does a job: call `print`, bind a name, choose a branch, repeat, define a function. Many statements contain expressions. `print(2 + 3)` is a statement whose argument is an expression.

:::why
The interpreter walks your file from top to bottom, one statement at a time. Later lines do not run until earlier lines finish, unless you define a function. Defining a function stores it. Calling it runs it. That difference matters the first time you write `def` and nothing seems to happen.
:::

## What Python is good at

Python is used for websites (Django, FastAPI), data work, automation, scripting, and teaching. It favors readable code. The cost is speed of the CPU-heavy inner loop compared with C or Rust. For a website, the slow part is usually the database and the network, which is why Django in Python is a normal production choice.

## What you type versus what you mean

Python is case-sensitive. `print` works. `Print` does not. Spaces at the start of a line are syntax, not decoration. A missing quote, a missing colon, or a mismatched parenthesis stops the program before it runs the rest.

```python
print("The quote must close")
```

:::watch
Smart quotes copied from a document (`“ ”`) are not Python quotes (`" "`). If you paste from a word processor or a chat, retype the quotes.
:::

## The pieces you will learn, in the order you need them

| Piece | What it lets you do |
| --- | --- |
| Names and objects | Remember values |
| Types | Know what operations are legal |
| Conditions and loops | Decide and repeat |
| Functions | Name a chunk of work |
| Collections | Hold many values |
| Modules | Split a program across files |
| Classes | Bundle data with the operations on it |
| Exceptions | Recover when something fails |

Django sits on top of all of those. A Django view is a function. A model is a class. A setting is a name bound to an object.

:::quiz
Which line is an expression that produces a value, rather than a statement that only does a job?
- print("hello")
+ 2 + 3
- A whole file of instructions
because: 2 + 3 evaluates to 5. print(...) is a statement that uses an expression and then displays it.
:::
