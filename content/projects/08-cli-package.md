---
id: project-cli-package
track: project
level: Advanced
module: Advanced Python
title: Project — package a command
minutes: 28
keywords: pyproject, package, entry point, venv, project
summary: Turn the word toolkit into an installable command. The logic stays importable. The command is a thin entry point.
---

You already have `top()` in the word toolkit. This project puts it in a package so `wordcount report.txt` works after install, from any folder.

## Layout

```text
wordcount_tool/
  pyproject.toml
  src/
    wordcount_tool/
      __init__.py
      tally.py
      cli.py
```

`src/` means "running from the project folder does not accidentally import a half-installed copy." Move `words`, `tally`, and `top` into `tally.py` unchanged. `cli.py` only parses arguments and prints.

```python
def main():
    import sys
    from pathlib import Path
    import argparse
    from wordcount_tool.tally import top

    parser = argparse.ArgumentParser(prog="wordcount")
    parser.add_argument("path")
    parser.add_argument("--top", type=int, default=5)
    args = parser.parse_args()
    text = Path(args.path).read_text(encoding="utf-8")
    for word, count in top(text, args.top):
        print(f"{count:>5} {word}")
    return 0
```

## pyproject.toml

```toml
[project]
name = "wordcount-tool"
version = "0.1.0"
description = "Count words in a text file"
requires-python = ">=3.12"
dependencies = []

[project.scripts]
wordcount = "wordcount_tool.cli:main"

[build-system]
requires = ["setuptools>=68"]
build-backend = "setuptools.build_meta"

[tool.setuptools.packages.find]
where = ["src"]
```

No third-party dependencies is a feature. You practiced the standard library on purpose.

## Install it into a venv

```powershell
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -e .
wordcount some.txt --top 3
```

`-e` installs in editable mode. You change `tally.py`, and the command sees the change without reinstalling.

## What "packaged" requires

- `import wordcount_tool.tally` works after install.
- `wordcount -h` prints help and exits 0.
- A missing file raises a clear error from `pathlib`, not a stack you have to decode for a friend. Catch `FileNotFoundError` in `main` and `print` to stderr, then `return 1`.
- Tests import `tally` and do not install anything.

:::watch
Putting the word-splitting logic inside `main` means the tests have to run the command. Keep the logic importable. The entry point is allowed to be boring.
:::

:::quiz
What does an entry point in pyproject.toml create?
+ A command on your PATH that calls the function you named
- A Django app
- A virtual environment
because: project.scripts maps a command name to module:function. pip creates the command when you install.
:::
