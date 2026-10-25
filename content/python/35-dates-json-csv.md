---
id: dates-json-csv
track: python
level: Intermediate
module: Intermediate Python
title: Dates, JSON, and CSV
minutes: 16
keywords: datetime, timezone, json, csv, zoneinfo, ISO
summary: Store instants in UTC. Convert to a local zone at the edges. JSON and CSV are text formats with sharp edges you should handle on purpose.
---

```python
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

now = datetime.now(timezone.utc)
later = now + timedelta(hours=2)
local = now.astimezone(ZoneInfo("Asia/Kolkata"))
print(now.isoformat())
print(local.isoformat())
```

A **naive** datetime has no `tzinfo`. A **aware** datetime does. Mixing them in a comparison raises `TypeError` on current Python. Django stores aware datetimes when `USE_TZ` is True, which is the default and the setting you should keep. The database value is UTC. Templates and forms convert using the current time zone.

`date` has no time. `time` has no date. `timedelta` is a duration. `datetime.fromisoformat` parses the strings `isoformat` writes. Do not parse dates with `str.split` when the standard method exists.

## JSON

```python
import json
payload = json.dumps({"ok": True, "n": 1, "tags": ["a"]})
print(json.loads(payload))
```

JSON numbers that are whole become `int`. Objects become `dict`. Lists become `list`. `True`, `False`, and `None` map to `true`, `false`, and `null`. Datetimes, sets, and bytes do not convert unless you supply a `default` function. Django's `DjangoJSONEncoder` knows about those types. `json.loads` of untrusted text is safe as a parser. What you do with the data afterwards is the risk.

## CSV

```python
import csv
from pathlib import Path

path = Path("scores.csv")
with path.open("w", newline="", encoding="utf-8") as handle:
    writer = csv.writer(handle)
    writer.writerow(["name", "score"])
    writer.writerow(["Ada", 10])

with path.open(newline="", encoding="utf-8") as handle:
    for row in csv.DictReader(handle):
        print(row["name"], row["score"])
```

`newline=""` lets the csv module handle line endings itself. Excel on Windows often writes a dialect with semicolons or a BOM. `utf-8-sig` reads a BOM. `csv` does not guarantee types: every cell comes back as a string.

:::watch
`datetime.now()` without a timezone is naive. In a Django project that value will fight `USE_TZ`. Use `django.utils.timezone.now()`, which returns an aware UTC datetime.
:::

:::quiz
What does USE_TZ = True mean for values you save?
+ Datetimes should be aware, and Django normalizes storage to UTC
- Times are stored in the visitor's local zone inside the database
- Dates are stored as strings
because: Aware UTC in the database, local presentation at the edge, is the rule that survives users in more than one country.
:::
