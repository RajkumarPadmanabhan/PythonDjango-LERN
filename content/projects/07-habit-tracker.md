---
id: project-habit-tracker
track: project
level: Intermediate
module: Intermediate Python
title: Project — habit tracker
minutes: 32
keywords: json, date, id, project, module
summary: Track habits by id, mark today done once, and show a streak. Dates are real dates, not strings you slice.
---

Commands:

- `add "read"` creates a habit and prints its id
- `done 3` marks habit 3 done for today
- `list` shows each habit, whether today is done, and the current streak
- `quit`

Marking the same habit done twice on the same day does not add a second check. The streak is the number of consecutive days ending today, or ending yesterday if today is not done yet.

File: `labs/projects/habit_tracker.py`. Store `habits.json` beside the script.

## Model

```python
def add_habit(state, name, today):
    cleaned = name.strip()
    if not cleaned:
        raise ValueError("Name required")
    habit_id = state["next_id"]
    state["next_id"] = habit_id + 1
    state["habits"].append({"id": habit_id, "name": cleaned, "days": []})
    return habit_id
```

Ids only go up. Deleting a habit later must not reuse an id, or a stale `done 3` could hit a new habit. That is the pro habit hiding in a beginner-looking program: identity is not the row's position.

`days` is a list of ISO date strings, `YYYY-MM-DD`, produced by `date.isoformat()`. Parse them back with `date.fromisoformat`. Do not slice the string to do calendar math.

## Streak

```python
from datetime import date, timedelta

def streak(days, today):
    owned = {date.fromisoformat(day) for day in days}
    cursor = today if today in owned else today - timedelta(days=1)
    count = 0
    while cursor in owned:
        count += 1
        cursor -= timedelta(days=1)
    return count
```

A set of dates makes the membership test obvious. Walking backward stops at the first gap. If today is not done, the streak still counts through yesterday, which matches "I have not failed yet today."

## Done, once

```python
def mark_done(state, habit_id, today):
    habit = find(state, habit_id)
    iso = today.isoformat()
    if iso in habit["days"]:
        return False
    habit["days"].append(iso)
    habit["days"].sort()
    return True
```

`False` means "already marked." `main` can print "Already done today" and skip the save. `True` means the file must be written.

`find` raises `ValueError` if the id is missing. Do not return `None` and then crash on the next line with a worse message.

:::tip
Pass `today` into every function. `date.today()` inside `streak` makes yesterday's test impossible. The clock is an argument, the same way `input` was an argument in the guessing game.
:::

:::try
Add `miss 3` that removes today's date if it was marked, and leaves other days alone. Recompute the streak from the stored days. Do not store the streak in the file.
:::

:::solution
Find the habit, drop `today.isoformat()` from `days` if present, save. `list` calls `streak` when it prints. A stored streak would be a second copy of the truth and would go stale the moment you edit `days`.
:::

:::quiz
Why not use the list position as the habit id?
+ Deleting an earlier habit would renumber the rest, and old commands would hit the wrong habit
- JSON forbids integers
- Dates cannot be stored next to integers
because: An id is identity. A position changes when the list changes. They are different numbers.
:::
