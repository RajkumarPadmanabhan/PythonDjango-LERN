---
id: project-word-toolkit
track: project
level: Intermediate
module: Intermediate Python
title: Project — word toolkit
minutes: 26
keywords: Counter, pathlib, argparse, test, project
summary: A small library that counts words, finds the most common ones, and reads a text file. Tests call the functions. A command prints the report.
---

Build `labs/projects/word_toolkit.py`. It counts words in a string or a file and prints the top ones. Words are compared case-insensitively and displayed in lowercase. Punctuation stuck to a word is stripped.

Concepts: `collections.Counter`, `re` or `str.strip`, `argparse`, tests that do not need a terminal.

## The functions

```python
import re
from collections import Counter

TOKEN = re.compile(r"[A-Za-z0-9']+")

def words(text):
    return [match.group(0).casefold() for match in TOKEN.finditer(text)]

def tally(text):
    return Counter(words(text))

def top(text, limit=5):
    return tally(text).most_common(limit)
```

`most_common` returns `(word, count)` pairs, highest count first. Ties keep the order `Counter` first saw them. Document that. Do not promise alphabetical ties unless you sort them yourself: `sorted(counts.items(), key=lambda item: (-item[1], item[0]))`.

## A command

```python
def main(argv):
    import argparse
    from pathlib import Path
    parser = argparse.ArgumentParser(description="Count words in a text file")
    parser.add_argument("path")
    parser.add_argument("--top", type=int, default=5)
    args = parser.parse_args(argv)
    text = Path(args.path).read_text(encoding="utf-8")
    for word, count in top(text, args.top):
        print(f"{count:>5} {word}")
```

Call `main(sys.argv[1:])` from the `if __name__` block. Tests call `top` and never `main`.

```python
def self_check():
    assert words("Ada, ada!") == ["ada", "ada"]
    assert top("one one two", 2) == [("one", 2), ("two", 1)]
```

:::why
`argparse` turns the command line into an object and prints help for `-h`. Parsing `sys.argv` by hand is fine for `add` and `quit`. It gets messy as soon as you have flags. This project is the moment to switch.
:::

:::try
Ignore a stoplist. `top(text, 5, skip={"the", "a"})` must not return those words. The default skip is an empty frozenset, not a list, so the default cannot be mutated by a caller.
:::

:::solution
Filter after tokenization: `Counter(word for word in words(text) if word not in skip)`. Default `skip=frozenset()`. A list default would be the shared-mutable bug from the functions lesson.
:::

:::quiz
What should a test call?
+ top or words, with a string you wrote in the test
- input, so the test types
- print, and then you read the screen yourself
because: The report is data. Printing is the edge. Tests stay on the data.
:::
