---
id: how-python-runs
track: python
level: Beginner
module: Start here
title: How Python runs your file
minutes: 16
keywords: bytecode, traceback, syntax error, indentation, colon
summary: Python compiles your file to bytecode, then executes it top to bottom. Indentation and colons are part of the grammar.
---

When you run `python hello.py`, CPython does three things:

1. Reads the text.
2. Compiles it to bytecode, a compact form the virtual machine understands. You may see `__pycache__/*.pyc`. That cache is an optimization. You can delete it.
3. Executes the bytecode from the top of the file.

A **syntax error** is found at compile time. Nothing in the file runs. A **runtime error** happens while a line is executing. Lines above it have already finished.

```python
print("this runs")
print("this does not"  # missing parenthesis — the whole file fails to compile
```

Fix the quote and parenthesis, and both lines can run. If the mistake is `print(1 / 0)`, the first `print` of a previous line would already have happened, because division by zero is a runtime error.

## Indentation

Python uses indentation to show which lines belong together. Use four spaces per level. Do not mix tabs and spaces.

```python
temperature = 30
if temperature > 25:
    print("warm")
    print("still inside the if")
print("always runs")
```

The colon at the end of `if` says "a block follows." The indented lines are that block. The last `print` is back at the outer level, so it runs whether or not the condition was true.

:::why
The block is not marked with braces. The indent is the mark. A tool that strips leading spaces destroys the program. Most editors can insert four spaces when you press Tab. Turn that on.
:::

## Tracebacks

When a runtime error happens, Python prints a traceback: the chain of calls from the start of your file down to the failing line. Read it from the bottom.

```text
Traceback (most recent call last):
  File "hello.py", line 3, in <module>
    print(1 / 0)
          ~~^~~
ZeroDivisionError: division by zero
```

The exception name is `ZeroDivisionError`. The file and line are yours. Later, when the stack passes through Django, skip the frames in `site-packages` until you find your file, then read the message.

## Names of the stages

| Stage | Failure looks like |
| --- | --- |
| Parsing / compiling | `SyntaxError`, `IndentationError` — no line of the file has run |
| Execution | Any other exception, with a traceback |
| Import | An exception while loading a module, often at the top of a file |

:::watch
A common syntax error is a missing colon after `if`, `for`, `while`, `def`, `class`, `try`, `except`, `with`, or `elif`. The following line is then "unexpected" even though the real mistake is above it.
:::

:::quiz
If a file has a SyntaxError on line 10, what has line 3 done?
- It has already printed and saved its work
+ It has not run. The file did not compile
- It ran only if line 3 was a print
because: Syntax errors are found before execution starts, so no statement in that file runs.
:::
