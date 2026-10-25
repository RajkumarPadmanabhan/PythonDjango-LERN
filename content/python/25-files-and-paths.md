---
id: files-and-paths
track: python
level: Beginner
module: Functions and files
title: Files and paths
minutes: 18
keywords: open, pathlib, encoding, with, json
summary: Open text as Unicode with an explicit encoding. Use pathlib for paths. with closes the file even when an exception fires.
---

```python
from pathlib import Path

path = Path("notes.txt")
path.write_text("first line\nsecond line\n", encoding="utf-8")
print(path.read_text(encoding="utf-8"))
```

`Path` objects join with `/`: `Path("labs") / "notes.txt"`. That uses the right separator on Windows and on Linux. Methods you will use constantly: `exists`, `is_file`, `mkdir(parents=True, exist_ok=True)`, `iterdir`, `glob("*.py")`, `read_text`, `write_text`, `read_bytes`, `unlink(missing_ok=True)`.

## open and with

```python
from pathlib import Path

path = Path("notes.txt")
with path.open("w", encoding="utf-8") as handle:
    handle.write("hello\n")

with path.open("r", encoding="utf-8") as handle:
    for line in handle:
        print(line.rstrip("\n"))
```

`with` calls `close` when the block ends, including when it ends by exception. A file object is iterable and yields lines, including the newline. Streaming line by line does not load a large file all at once.

Modes: `"r"` read text, `"w"` write text (truncates), `"a"` append, `"x"` create and fail if the file exists, `"b"` binary. `"rb"` and `"wb"` do not take an encoding.

## Encoding

On Python 3.15, UTF-8 is the default encoding even when the Windows locale is not UTF-8 (PEP 686). Pass `encoding="utf-8"` anyway. Explicit encoding is compatible with older Python and documents the file format. `encoding="locale"` is the escape hatch for the old behavior.

:::why
Text files are bytes on disk plus an agreement about how those bytes become characters. If you write UTF-8 and read with a different encoding, you get `UnicodeDecodeError` or silent mojibake. Pick UTF-8 for new files and say so in `open`.
:::

## CSV and JSON, the short version

```python
import json
from pathlib import Path

payload = {"names": ["Ada", "Grace"]}
Path("people.json").write_text(json.dumps(payload), encoding="utf-8")
print(json.loads(Path("people.json").read_text(encoding="utf-8")))
```

JSON objects become dicts. JSON has no tuples. `json.dump(obj, file)` writes to an open file. The dates lesson shows `csv`.

:::watch
`write_text` replaces the whole file. There is no undo. For configuration a person might edit, write to a temporary file in the same directory and replace the target, so a crash does not leave a half-written file. `Path.replace` is atomic on the same filesystem.
:::

:::try
Using pathlib, write `score.txt` containing the line `10`, read it back, convert to int, and print one more than that number. Use UTF-8.
:::

:::solution
```python
from pathlib import Path

path = Path("score.txt")
path.write_text("10\n", encoding="utf-8")
number = int(path.read_text(encoding="utf-8").strip())
print(number + 1)
```
:::

:::quiz
What does with path.open(...) guarantee?
+ The file is closed when the block exits, including on an exception
- The file is written as JSON
- The path is created as a directory
because: with uses the context-manager protocol. A file's exit method closes the handle.
:::
