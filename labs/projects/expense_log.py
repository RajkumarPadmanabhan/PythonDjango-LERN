"""An expense log stored as JSON.

Run: py -3 labs/projects/expense_log.py
"""

from __future__ import annotations

import json
from decimal import Decimal, InvalidOperation
from pathlib import Path

DATA_PATH = Path(__file__).with_name("expenses.json")


def make_entry(amount_text, note):
    try:
        amount = Decimal(amount_text)
    except InvalidOperation as exc:
        raise ValueError("Amount must be a number") from exc
    if amount <= 0:
        raise ValueError("Amount must be greater than zero")
    note = note.strip()
    if not note:
        raise ValueError("Add a short note")
    return {"amount": format(amount, "f"), "note": note}


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


def handle(line, entries):
    parts = line.strip().split(maxsplit=1)
    if not parts:
        raise ValueError("Try add, list, total, or quit")
    command = parts[0].casefold()
    if command == "add":
        if len(parts) == 1:
            raise ValueError("Use: add 12.50 lunch")
        amount_and_note = parts[1].split(maxsplit=1)
        if len(amount_and_note) != 2:
            raise ValueError("Use: add 12.50 lunch")
        entries.append(make_entry(amount_and_note[0], amount_and_note[1]))
        return "added"
    if command == "list":
        return "list"
    if command == "total":
        return "total"
    raise ValueError("Unknown command")


def self_check():
    entries = []
    assert handle("add 12.50 lunch", entries) == "added"
    assert total(entries) == Decimal("12.50")
    try:
        handle("add -1 bad", entries)
    except ValueError:
        pass
    else:
        raise AssertionError("negative amounts must fail")
    assert len(entries) == 1


def main():
    self_check()
    entries = load_entries(DATA_PATH)
    print("Commands: add 12.50 lunch, list, total, quit")
    while True:
        try:
            line = input("> ")
        except (EOFError, KeyboardInterrupt):
            print()
            break
        if line.strip().casefold() in {"quit", "q"}:
            break
        try:
            result = handle(line, entries)
        except ValueError as exc:
            print(exc)
            continue
        if result == "added":
            save_entries(DATA_PATH, entries)
            print("Saved.")
        elif result == "list":
            if not entries:
                print("No expenses yet.")
            for index, item in enumerate(entries, start=1):
                print(f"{index}. {item['amount']}  {item['note']}")
        else:
            print(total(entries))


if __name__ == "__main__":
    main()
