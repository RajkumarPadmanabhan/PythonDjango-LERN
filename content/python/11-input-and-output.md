---
id: input-and-output
track: python
level: Beginner
module: Data
title: Printing and input
minutes: 12
keywords: print, input, sep, end, repr, f-string
summary: print writes text to standard output. input reads a line as a string, always.
---

`print` converts each argument with `str` and writes them separated by a space, ending with a newline.

```python
print("Ada", "Lovelace", sep=", ")
print("loading", end="... ")
print("done")
print(repr("  spaced  "))
```

`sep` changes the separator. `end` changes the terminator. `repr` shows a value the way you might type it, including quotes, which makes spaces visible. In f-strings, `{value!r}` does the same.

`print(..., file=sys.stderr)` writes a diagnostic without mixing it into normal output that another program might pipe.

## input

`input(prompt)` prints the prompt and returns the line the user typed, **without** the trailing newline, **as a string**.

```python
# age = int(input("Age: "))
# print(age + 1)
```

The browser runner has no keyboard attached to `input`. Run input programs in your terminal. If the user types `30`, you receive `"30"`. Adding 1 without `int` raises `TypeError` or, worse, if you concatenate, produces `"301"`.

:::why
There is no "read an integer" built-in. The terminal only has text. Conversion is your decision, and it can fail. Wrap it in `try` / `except ValueError` once you know exceptions. Until then, experiment with values you know are valid.
:::

## Formatting when print is not enough

```python
rows = [("Ada", 12), ("Grace", 9)]
for name, score in rows:
    print(f"{name:<8} {score:>3}")
```

`<` aligns left, `>` aligns right, the number is the width. For tables you will later switch to a real template. For logs, use the `logging` module rather than `print`, so you can turn the noise off.

:::watch
Never put a password in an f-string that you log or that you build into a command. The logging lesson and the security lessons show safer patterns. For shell commands, pass a list of arguments to `subprocess` and do not build one big string.
:::

:::try
Print the numbers 1, 2, and 3 on one line separated by ` | `, with no trailing space before the newline. You only need `print`.
:::

:::solution
```python
print(1, 2, 3, sep=" | ")
```
:::

:::quiz
What type does input() return?
+ A string, even if the user typed digits
- An int when the text looks numeric
- None
because: The terminal supplies text. You convert with int or float if you need a number, and you handle ValueError when the text is not a number.
:::
