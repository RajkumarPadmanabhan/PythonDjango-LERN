---
id: strings
track: python
level: Beginner
module: Data
title: Strings and text
minutes: 24
keywords: str, f-string, slice, encode, t-string, unicode
summary: A string is an immutable sequence of Unicode characters. F-strings format values. Bytes are not strings.
---

A string (`str`) is a sequence of Unicode code points. You can write it with single quotes, double quotes, or triple quotes for text that spans lines. Strings are immutable: every method that looks like it changes a string returns a new one.

```python
title = "Pathline"
print(title[0], title[-1])
print(title[0:4])
print(len(title))
print("line" in title)
```

Indexing starts at 0. Negative indexes count from the end. A slice `s[start:stop:step]` includes `start` and excludes `stop`. Out-of-range slices are quiet. Out-of-range indexes raise `IndexError`.

## Common methods

```python
raw = "  Ada Lovelace  "
print(raw.strip())
print(raw.lower())
print("a,b,c".split(","))
print("-".join(["a", "b"]))
print("Hello".replace("H", "J"))
print("report.csv".endswith(".csv"))
print("404".isdigit())
```

`split()` with no argument splits on any whitespace and drops empty pieces. `split(",")` does not. `" ".join(items)` is how you build a string from many pieces. Repeated `+=` in a loop works but is the slow way to assemble a large string; collect pieces and `join` them.

## F-strings, raw strings, bytes

```python
name = "Ada"
score = 9.5
print(f"{name} scored {score:.1f}")
path = r"C:\new\test"
print(path)
data = "café".encode("utf-8")
print(data)
print(data.decode("utf-8"))
```

An f-string evaluates expressions inside `{}`. The format spec after `:` follows the same mini-language as `format`. `!r` uses `repr`, which is what you want when debugging.

A raw string (`r"..."`) treats backslashes as ordinary characters. Windows paths and regular expressions need this. A raw string cannot end in a single backslash.

`bytes` are raw octets. Text is `str`. The boundary between them is `encode` and `decode`. Files and HTTP bodies cross that boundary. Mixing them with `+` raises `TypeError`, which is the design protecting you.

## Other prefixes

| Prefix | Meaning |
| --- | --- |
| `f` or `F` | Formatted string |
| `r` or `R` | Raw string |
| `b` or `B` | Bytes literal |
| `t` or `T` | Template string (Python 3.14+). Returns a `Template`, not a `str` |
| `u` | Old synonym for a normal string. Ignored |

You can combine `r` and `f`: `rf"\n{name}"` is a raw f-string.

Template strings (t-strings) do not concatenate. They keep the literal parts and the interpolated values separate so a library can escape them. That is the safe way to build HTML or SQL from a template you control. Django's own template engine is the tool you will use for HTML. The idea is the same: never paste untrusted text into a command string.

```python
# Python 3.14+
# variety = "Stilton"
# template = t"Try some {variety}"
# type(template) is string.templatelib.Template
```

The browser runner may be older than 3.14, so run t-strings on your own interpreter.

## Useful extras

```python
print(ord("A"), chr(65))
print("na" * 3)
print("  ".join(["a", "b"]))
multiline = """first
second"""
print(multiline.splitlines())
```

`ord` and `chr` move between a character and its code point. `"na" * 3` repeats. Multiplication of a string by a number is defined. Addition of a string and a number is not.

:::watch
`"10" + 1` is a TypeError. Convert deliberately: `int("10") + 1` or `"10" + str(1)`. Silent conversion is how data gets corrupted.
:::

:::try
Given `full = "ada lovelace"`, produce `"Ada Lovelace"` with a method, then an f-string that prints `Ada has 3 letters in her first name`.
:::

:::solution
```python
full = "ada lovelace"
print(full.title())
first = full.split()[0]
print(f"{first.title()} has {len(first)} letters in her first name")
```
:::

:::quiz
What does s[1:4] return for s = "Pathline"?
+ The characters at indexes 1, 2, and 3: ath
- The characters at indexes 1, 2, 3, and 4
- A single character
because: The stop index is excluded. Slices copy those characters into a new string.
:::
