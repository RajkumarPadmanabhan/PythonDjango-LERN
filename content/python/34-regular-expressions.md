---
id: regular-expressions
track: python
level: Intermediate
module: Intermediate Python
title: Regular expressions
minutes: 16
keywords: re, pattern, group, raw string, match
summary: A regular expression is a small language for matching text. Compile it, use raw strings, and prefer string methods when they are enough.
---

```python
import re

email = re.compile(r"^[\w.+-]+@[\w-]+\.[\w.-]+$")
print(bool(email.match("ada@example.com")))
print(bool(email.match("not an email")))

text = "ids: 10, 20, and 30"
print(re.findall(r"\d+", text))
print(re.sub(r"\d+", "#", text))
```

Raw strings (`r"..."`) keep backslashes for the regex engine. `\d` means a digit. `\w` means a word character. `.` means any character except a newline. `+` is one or more. `*` is zero or more. `?` is zero or one. `{2,4}` is a count. `^` and `$` anchor the start and end. `[]` is a set. `()` captures a group.

```python
pattern = re.compile(r"(\w+)\s+(\d+)")
match = pattern.search("room 42")
print(match.group(1), match.group(2))
print(match.groups())
```

`search` finds a match anywhere. `match` anchors at the start. `fullmatch` requires the whole string. Compile a pattern you reuse in a loop.

Named groups read better: `r"(?P<room>\w+)\s+(?P<num>\d+)"` then `match.group("room")`.

## When not to use a regex

`"report.csv".endswith(".csv")` is clearer than a pattern. Splitting a known separator is `str.split`. HTML is not a regular language; parse it with a real parser. Email addresses have a standard that a short pattern only approximates. For user-facing validation in Django, use `EmailField` and form validators.

:::watch
A pattern like `r"(a+)+$"` can take exponential time on a long string of `a`s that almost matches. This is catastrophic backtracking. Do not let untrusted users supply the pattern. Prefer specific quantifiers, and reject oversized input before matching. Django's URL routing uses its own path converters so you rarely put a regex in a URL. `re_path` is there when you must, and the same caution applies.
:::

:::try
Find every word that starts with a capital letter in `"Ada met Grace in London"`.
:::

:::solution
```python
import re
print(re.findall(r"\b[A-Z][a-z]+\b", "Ada met Grace in London"))
```
:::

:::quiz
Why are regex patterns usually written as raw strings?
+ So backslashes reach the regex engine instead of being eaten as Python escapes
- Because raw strings are faster to compile
- Because re refuses normal strings
because: Python string escapes and regex escapes both use backslash. A raw string disables the Python layer.
:::
