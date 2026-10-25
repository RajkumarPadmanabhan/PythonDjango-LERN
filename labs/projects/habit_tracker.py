"""Track daily habits and streaks.

Run: py -3 labs/projects/habit_tracker.py
"""

from __future__ import annotations

import json
from datetime import date, timedelta
from pathlib import Path

DATA_PATH = Path(__file__).with_name("habits.json")


def empty_state():
    return {"next_id": 1, "habits": []}


def load_state(path):
    if not path.exists():
        return empty_state()
    raw = json.loads(path.read_text(encoding="utf-8"))
    raw.setdefault("next_id", 1)
    raw.setdefault("habits", [])
    return raw


def save_state(path, state):
    path.write_text(json.dumps(state, indent=2) + "\n", encoding="utf-8")


def add_habit(state, name, today=None):
    cleaned = name.strip()
    if not cleaned:
        raise ValueError("Name required")
    habit_id = state["next_id"]
    state["next_id"] = habit_id + 1
    state["habits"].append({"id": habit_id, "name": cleaned, "days": []})
    return habit_id


def find(state, habit_id):
    for habit in state["habits"]:
        if habit["id"] == habit_id:
            return habit
    raise ValueError(f"No habit {habit_id}")


def mark_done(state, habit_id, today):
    habit = find(state, habit_id)
    iso = today.isoformat()
    if iso in habit["days"]:
        return False
    habit["days"].append(iso)
    habit["days"].sort()
    return True


def streak(days, today):
    owned = {date.fromisoformat(day) for day in days}
    cursor = today if today in owned else today - timedelta(days=1)
    count = 0
    while cursor in owned:
        count += 1
        cursor -= timedelta(days=1)
    return count


def self_check():
    state = empty_state()
    today = date(2026, 10, 25)
    habit_id = add_habit(state, "read")
    assert habit_id == 1
    assert mark_done(state, habit_id, today) is True
    assert mark_done(state, habit_id, today) is False
    assert streak(state["habits"][0]["days"], today) == 1
    yesterday = today - timedelta(days=1)
    mark_done(state, habit_id, yesterday)
    assert streak(find(state, habit_id)["days"], today) == 2


def main():
    self_check()
    state = load_state(DATA_PATH)
    print('Commands: add "read", done 1, list, quit')
    while True:
        try:
            line = input("> ").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            break
        if line.casefold() in {"q", "quit"}:
            break
        today = date.today()
        try:
            parts = line.split(maxsplit=1)
            command = parts[0].casefold() if parts else ""
            if command == "add":
                habit_id = add_habit(state, parts[1] if len(parts) > 1 else "")
                save_state(DATA_PATH, state)
                print(f"Added {habit_id}")
            elif command == "done":
                changed = mark_done(state, int(parts[1]), today)
                if changed:
                    save_state(DATA_PATH, state)
                    print("Marked.")
                else:
                    print("Already done today.")
            elif command == "list":
                for habit in state["habits"]:
                    done = "yes" if today.isoformat() in habit["days"] else "no"
                    print(f"{habit['id']}. {habit['name']} today={done} streak={streak(habit['days'], today)}")
            else:
                print("Unknown command.")
        except (ValueError, IndexError) as exc:
            print(exc)


if __name__ == "__main__":
    main()
