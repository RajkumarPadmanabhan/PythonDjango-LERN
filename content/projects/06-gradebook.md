---
id: project-gradebook
track: project
level: Intermediate
module: Intermediate Python
title: Project — gradebook
minutes: 30
keywords: csv, statistics, pathlib, project
summary: Read a CSV of names and scores, compute each student's average, and write a second CSV of results.
---

A teacher has `grades.csv`:

```text
name,score
Ada,90
Ada,80
Grace,100
```

Your program writes `report.csv` with one row per student: name, count, average. Averages use `Decimal` and two decimal places. Blank scores are an error that names the row. Do not skip them silently.

File: `labs/projects/gradebook.py`.

## Read

```python
import csv
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path

def read_scores(path):
    groups = {}
    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        for number, row in enumerate(reader, start=2):
            name = (row.get("name") or "").strip()
            raw = (row.get("score") or "").strip()
            if not name or not raw:
                raise ValueError(f"Row {number} needs a name and a score")
            try:
                score = Decimal(raw)
            except Exception as exc:
                raise ValueError(f"Row {number} is not a number") from exc
            groups.setdefault(name, []).append(score)
    return groups
```

`enumerate(..., start=2)` because row 1 is the header. The error a teacher sees should be "row 4", not "index 2".

Catch `InvalidOperation` rather than bare `Exception` in your version. The sample above is the shape. Narrow the type.

## Average

```python
def average(scores):
    if not scores:
        raise ValueError("No scores")
    mean = sum(scores, Decimal("0")) / Decimal(len(scores))
    return mean.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
```

`quantize` is the "two decimal places" rule. `round(float, 2)` is the wrong tool once you chose `Decimal`.

## Write

```python
def write_report(path, groups):
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(["name", "count", "average"])
        for name in sorted(groups):
            scores = groups[name]
            writer.writerow([name, len(scores), average(scores)])
```

`newline=""` is required so Windows does not double the line endings. Sort the names so the file is stable. Two runs of the same input must produce the same output, or your tests flicker.

:::try
Reject a score outside 0 to 100, and include the student's name in the message.
:::

:::solution
After parsing the Decimal, `if not Decimal("0") <= score <= Decimal("100"): raise ValueError(f"Row {number}: {name} has a score outside 0-100")`. Compare Decimals to Decimals.
:::

:::quiz
Why mention the CSV row number in the error?
+ The person fixing the file needs a place to look
- csv.DictReader requires it
- Averages are undefined without a row number
because: "Not a number" with no location sends them hunting. The program already knows the line.
:::
