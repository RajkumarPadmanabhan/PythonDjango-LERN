"""A small address book.

Run: py -3 labs/contact_book.py
"""

from __future__ import annotations

import json
from pathlib import Path

DATA_PATH = Path(__file__).with_name("contacts.json")


def load_contacts(path: Path = DATA_PATH) -> dict[str, dict[str, str]]:
    if not path.exists():
        return {}
    try:
        raw = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise ValueError(f"Could not read {path.name}: {exc}") from exc
    if not isinstance(raw, dict):
        raise ValueError(f"{path.name} does not contain a contact object")
    return raw


def save_contacts(contacts: dict[str, dict[str, str]], path: Path = DATA_PATH) -> None:
    path.write_text(json.dumps(contacts, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def add_contact(contacts: dict[str, dict[str, str]], name: str, phone: str) -> None:
    display = name.strip()
    key = display.casefold()
    if not key or not phone.strip():
        raise ValueError("Name and phone are required")
    contacts[key] = {"name": display, "phone": phone.strip()}


def find_contact(contacts: dict[str, dict[str, str]], name: str) -> dict[str, str] | None:
    return contacts.get(name.casefold())


def delete_contact(contacts: dict[str, dict[str, str]], name: str) -> bool:
    return contacts.pop(name.casefold(), None) is not None


def self_check() -> None:
    book: dict[str, dict[str, str]] = {}
    add_contact(book, "Ada", "111")
    add_contact(book, "ada", "222")
    assert book["ada"]["phone"] == "222"
    assert find_contact(book, "ADA")["name"] == "ada"
    assert delete_contact(book, "Ada") is True
    assert delete_contact(book, "Ada") is False
    try:
        add_contact(book, "  ", "1")
    except ValueError:
        pass
    else:
        raise AssertionError("blank names must be rejected")


def main() -> None:
    self_check()
    try:
        contacts = load_contacts()
    except ValueError as exc:
        print(exc)
        return
    print("Commands: add, find, list, delete, quit")
    while True:
        try:
            command = input("> ").strip().casefold()
        except (EOFError, KeyboardInterrupt):
            print()
            break
        if command in {"quit", "q"}:
            break
        if command == "list":
            if not contacts:
                print("No contacts yet.")
                continue
            for record in sorted(contacts.values(), key=lambda item: item["name"].casefold()):
                print(f"{record['name']}: {record['phone']}")
            continue
        if command not in {"add", "find", "delete"}:
            print("Unknown command.")
            continue
        name = input("Name: ").strip()
        if command == "add":
            phone = input("Phone: ").strip()
            try:
                add_contact(contacts, name, phone)
            except ValueError as exc:
                print(exc)
                continue
            save_contacts(contacts)
            print("Saved.")
        elif command == "find":
            record = find_contact(contacts, name)
            print(f"{record['name']}: {record['phone']}" if record else "Not found.")
        else:
            if delete_contact(contacts, name):
                save_contacts(contacts)
                print("Deleted.")
            else:
                print("Not found.")


if __name__ == "__main__":
    main()
