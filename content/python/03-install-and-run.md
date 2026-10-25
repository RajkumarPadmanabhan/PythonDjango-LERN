---
id: install-and-run
track: python
level: Beginner
module: Start here
title: Install Python and run a file
minutes: 18
keywords: py, venv, REPL, pip, python
summary: Install Python 3.12 or newer, run a file, and keep each project inside its own virtual environment.
---

Install Python from [python.org/downloads](https://www.python.org/downloads/). On Windows, enable **Add python.exe to PATH** in the installer, or rely on the `py` launcher, which the installer provides anyway. Check the install in PowerShell:

```powershell
py -3 --version
python --version
```

You want 3.12 or newer. Python 3.15.1 is current as of October 2026. Django 6.1 supports 3.12, 3.13, 3.14, and 3.15.

## The REPL

The REPL (read, eval, print, loop) runs one line at a time. Start it with `py -3` and leave it with `exit()` or Ctrl+Z then Enter on Windows.

```pycon
>>> 1 + 1
2
>>> "hello"
'hello'
```

Use the REPL to ask small questions. Use a file for anything you want to keep.

## A file

Create `hello.py`:

```python
name = "Ada"
print("Hello,", name)
```

Run it from the folder that contains the file:

```powershell
py -3 hello.py
```

The working directory matters. If PowerShell is in `C:\Users\You` and the file is on your Desktop, either `cd` to the Desktop or pass the full path.

## Virtual environments

A virtual environment is a private folder of packages for one project. Two projects can then depend on different Django versions without fighting.

```powershell
cd C:\Users\Rajkumar\Downloads\PythonDjango-LERN\labs\taskboard
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

`Activate.ps1` changes the prompt so `python` and `pip` point inside `.venv`. On macOS or Linux the activate script is `.venv/bin/activate`.

If PowerShell blocks the script, run this once in a window you trust:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

:::why
`python -m pip` runs pip as a module of the interpreter you just named. Typing `pip` alone can hit a different Python. The `-m` form is the one that matches the environment you activated.
:::

:::watch
Do not commit `.venv`. It is large, machine-specific, and already ignored by this repository's `.gitignore`. Commit `requirements.txt` instead, and recreate the environment anywhere else.
:::

## Where code lives

| Tool | Use it for |
| --- | --- |
| REPL | One-off questions |
| `file.py` | Programs you keep |
| `python -m venv .venv` | Isolating a project's packages |
| `python -m pip install ...` | Installing libraries into that environment |
| This website's Run button | The short Python examples in the lessons |

## Comments

A comment starts at `#` and runs to the end of the line. Python ignores it. Comments should say why, not repeat what the next line already says.

```python
# Greet the person whose name we just bound.
print("Hello,", name)
```

:::try
Create `about.py` that prints your name on one line and the result of `20 + 22` on the next. Run it with `py -3 about.py`.
:::

:::solution
```python
print("Your Name")
print(20 + 22)
```
:::

:::quiz
Why prefer `python -m pip` after you activate a virtual environment?
- It installs packages for every Python on the computer
+ It uses the same interpreter as the active environment
- It writes the package into the lesson website
because: The -m switch runs the module with the interpreter you invoked, so packages land in that environment.
:::
