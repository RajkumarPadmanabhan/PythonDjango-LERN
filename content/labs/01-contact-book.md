---
id: lab-contact-book
track: lab
level: Beginner
module: Practice projects
title: Lab — contact book
minutes: 25
keywords: lab, dict, pathlib, json, exception
summary: Build a command-line address book that saves contacts to a JSON file. The finished program is labs/contact_book.py.
---

The file `labs/contact_book.py` is a complete program. Read this lesson, try to write your own, then compare.

## Behavior

- Commands: `add`, `find`, `list`, `delete`, `quit`.
- A contact is a name and a phone number, both strings.
- Names are stored with their original case, and lookup is case-insensitive.
- Data is saved to `contacts.json` next to the script after every change.
- A missing file starts an empty book.
- Bad JSON does not crash without a message. Tell the user the file could not be read.
- `delete` of a missing name explains that, and does not rewrite the file with damage.

## Pieces you already know

A dict maps the lookup key to a record. `pathlib.Path` finds the file beside the script using `Path(__file__).with_name("contacts.json")`, so the command works no matter which directory you launched it from. `json.dumps` and `json.loads` move between the dict and text. `try` handles `json.JSONDecodeError` and unknown commands. `if __name__ == "__main__"` starts the loop so the functions stay importable.

## Hidden logic to notice

The dict key is `name.casefold()`, and the record keeps the display name. If you use the display name as the key, `Ada` and `ada` become two people. `casefold` is the comparison form. It is more reliable than `lower` for some alphabets.

Writing the file: dump to a string, write the text, and if you want to be careful, write a temporary file and replace. The lab writes the text directly, which is acceptable for a practice file and not acceptable for a database.

## Run it

```powershell
py -3 labs\contact_book.py
```

There is a `self_check()` function at the bottom of the file's helpers. The `if __name__` block runs it before the menu so a broken edit fails immediately with an assertion.

:::try
Add a `rename` command that changes the display name and the lookup key without dropping the phone number. Refuse the rename if the new key already exists.
:::

:::solution
Look up the old key with `casefold`. If the new key exists and is not the same record, refuse. Pop the old entry, store the record under the new key with the new display name, and save.
:::
