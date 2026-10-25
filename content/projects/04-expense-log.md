---
id: project-expense-log
track: project
level: Beginner
module: Beginner Python
title: Project — expense log
minutes: 28
keywords: json, pathlib, Decimal, project, file
summary: Record amounts in a JSON file. Add, list, and total them. Restart the program and the rows are still there.
---

Build a command-line ledger. Commands: `add 12.50 lunch`, `list`, `total`, `quit`. Amounts are `Decimal`. The file is `expenses.json` beside the script.

Concepts: `pathlib`, `json`, `Decimal`, command parsing, "do not lose the file."

File: `labs/projects/expense_log.py`.

## The record

```python
def make_entry(amount_text, note):
    amount = Decimal(amount_text)
    if amount <= 0:
        raise ValueError("Amount must be greater than zero")
    note = note.strip()
    if not note:
        raise ValueError("Add a short note")
    return {"amount": str(amount), "note": note}
```

Store the amount as a string in JSON. JSON numbers are not decimals. `str(Decimal("12.50"))` round-trips through `Decimal` later. A float in the file would bring back the `0.1 + 0.2` problem.

## Load and save

```python
def load_entries(path):
    if not path.exists():
        return []
    raw = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(raw, list):
        raise ValueError("The expense file is not a list")
    return raw

def save_entries(path, entries):
    path.write_text(json.dumps(entries, indent=2) + "\n", encoding="utf-8")

def total(entries):
    return sum((Decimal(item["amount"]) for item in entries), Decimal("0"))
```

`sum` needs a start value of `Decimal("0")`. The default start is the integer `0`, and `Decimal + int` is allowed, but starting from `Decimal` keeps the type obvious.

Write the file only after a successful `add`. A failed parse must not wipe the old list.

## Commands

Split the line once: the command, then the rest.

```python
def handle(line, entries):
    parts = line.strip().split(maxsplit=1)
    if not parts:
        raise ValueError("Try add, list, total, or quit")
    command = parts[0].casefold()
    if command == "add":
        if len(parts) == 1:
            raise ValueError("Use: add 12.50 lunch")
        amount_text, note = parts[1].split(maxsplit=1)
        entries.append(make_entry(amount_text, note))
        return "added"
    if command == "list":
        return entries
    if command == "total":
        return total(entries)
    raise ValueError("Unknown command")
```

`handle` mutates `entries` only for `add`. `main` saves when the result is `"added"`.

:::watch
`path.write_text` replaces the file. A crash in the middle can leave it empty on some systems. For this project that risk is acceptable if you write only after validation. The pro version writes a temporary file in the same folder and `Path.replace`s it into place.
:::

:::try
Add `remove 1` that deletes the first listed expense, using the number the user sees in `list` (starting at 1). Refuse a number that is not on the list.
:::

:::solution
`index = int(text) - 1`. If `index` is outside `range(len(entries))`, raise `ValueError`. Otherwise `del entries[index]` and tell `main` to save. Do not use the JSON order as a secret id yet. A later project uses real ids because deleting from the middle renumbers the list.
:::

:::quiz
Why store the amount as a string in JSON?
+ JSON numbers are binary-friendly floats. A string preserves the decimal you typed
- JSON cannot store numbers
- Decimal objects are written automatically
because: json.dumps of a Decimal fails unless you convert it. A string is the conversion that stays exact.
:::
