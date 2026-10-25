---
id: debugging-and-style
track: python
level: Intermediate
module: Intermediate Python
title: Debugging and style
minutes: 14
keywords: pdb, breakpoint, PEP 8, traceback, logging
summary: Read the traceback, reproduce the bug in a test, then use breakpoint or a print of repr. Style is how the next reader follows you.
---

## A debugging loop

1. Read the last line of the traceback, then the last frame that is your file.
2. Reproduce it with the smallest input.
3. Write a test that fails the same way, if you can.
4. Inspect values at the failing line.
5. Fix, watch the test pass, and keep the test.

`breakpoint()` drops you into `pdb`. `n` steps to the next line, `s` steps into a call, `c` continues, `p expr` prints, `l` lists code, `q` quits. In a Django request, `breakpoint()` pauses the server process. That is useful locally and unacceptable in production. Guard it, or use logging.

```python
def mystery(values):
    total = 0
    for value in values:
        breakpoint()  # remove after you understand the value
        total += value
    return total
```

When you cannot pause, log `repr(value)` so spaces and types are visible. Logging a password or a session cookie is a bug of its own. Log identifiers, not secrets.

## Style that matters

PEP 8 is the house style. The rules that prevent real mistakes:

- Four spaces. Never mix tabs.
- One statement per line.
- Names that say what the value is (`user_id`, not `x`, except in a tiny comprehension).
- Functions short enough to hold in your head. If you need a comment to separate "part 2," consider a function.
- Imports at the top: standard library, third party, then local, separated by blank lines.
- Lines around 88–100 characters. Formatters (`ruff format` or `black`) end the argument.

`ruff` lints and formats. Run it on save. A linter catches undefined names, unused imports, and mutable defaults. It does not design the program.

## Reading other people's code

Start at the entry point: `manage.py`, a `urls.py`, or `if __name__ == "__main__"`. Follow one request or one command. Ignore the framework files until a traceback lands in them.

:::tip
`python -m trace --trace file.py` prints every line as it runs. It is noisy and occasionally the fastest way to see which branch is taken.
:::

:::quiz
Where do you look first in a traceback?
+ The exception line at the bottom, then the nearest frame in your own file
- The first line at the top
- Only the Django source
because: The bottom is the failure. Frames above it are how you got there. Your file is the frame you can change.
:::
