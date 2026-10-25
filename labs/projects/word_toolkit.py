"""Count words in text.

Library use: import the functions.
Command: py -3 labs/projects/word_toolkit.py notes.txt --top 5
"""

from __future__ import annotations

import argparse
import re
import sys
from collections import Counter
from pathlib import Path

TOKEN = re.compile(r"[A-Za-z0-9']+")


def words(text):
    return [match.group(0).casefold() for match in TOKEN.finditer(text)]


def tally(text):
    return Counter(words(text))


def top(text, limit=5, skip=frozenset()):
    counts = Counter(word for word in words(text) if word not in skip)
    ranked = sorted(counts.items(), key=lambda item: (-item[1], item[0]))
    return ranked[:limit]


def self_check():
    assert words("Ada, ada!") == ["ada", "ada"]
    assert top("one one two", 2) == [("one", 2), ("two", 1)]
    assert top("the cat the", 5, skip=frozenset({"the"})) == [("cat", 1)]


def main(argv=None):
    parser = argparse.ArgumentParser(description="Count words in a text file")
    parser.add_argument("path")
    parser.add_argument("--top", type=int, default=5)
    args = parser.parse_args(argv)
    text = Path(args.path).read_text(encoding="utf-8")
    for word, count in top(text, args.top):
        print(f"{count:>5} {word}")
    return 0


if __name__ == "__main__":
    self_check()
    if len(sys.argv) == 1:
        print("Self-check passed. Pass a text file to print a report.")
    else:
        raise SystemExit(main())
