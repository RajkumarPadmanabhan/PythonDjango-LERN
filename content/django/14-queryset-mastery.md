---
id: queryset-mastery
track: django
level: Advanced
module: Models and the database
title: QuerySet power tools
minutes: 20
keywords: select_related, prefetch_related, Q, F, annotate, aggregate, transaction
summary: select_related joins. prefetch_related batches. F and Q build expressions. annotate adds a computed column.
---

## Joins and batches

```python
tasks = Task.objects.select_related("owner").filter(done=False)
```

`select_related` is a SQL join. Use it for foreign keys and one-to-one. `prefetch_related` runs a second query and stitches the results in Python. Use it for many-to-many and reverse foreign keys.

```python
users = User.objects.prefetch_related("tasks")
```

Django 6.1 fetch modes change what happens when you touch an unfetched field:

| Mode | Behavior |
| --- | --- |
| `FETCH_ONE` | The default. Load the missing field for this instance |
| `FETCH_PEERS` | Load it for every instance that came from the same queryset. This collapses a class of N+1 bugs |
| `FETCH_RAISE` | Raise `FieldFetchBlocked` instead of querying |

```python
from django.db import models
books = Book.objects.fetch_mode(models.FETCH_PEERS)
for book in books:
    print(book.author.name)
```

That loop is two queries, not one per book. `FETCH_RAISE` is how you fail a test when a view accidentally queries.

## F, Q, annotate

```python
from django.db.models import Count, F, Q

Task.objects.filter(owner=user).update(priority=F("priority"))
open_or_mine = Task.objects.filter(Q(done=False) | Q(owner=user))
stats = Task.objects.aggregate(total=Count("id"), open=Count("id", filter=Q(done=False)))
leaders = (
    User.objects.annotate(task_count=Count("tasks"))
    .filter(task_count__gt=0)
    .order_by("-task_count")
)
```

`F` refers to a column, so the database does the update without a race against another request that also read the old value. `Q` objects combine with `|` and `&` and can be negated with `~`. `annotate` adds a value per row. `aggregate` returns a dict for the whole queryset.

Django 6 adds `order_by` on aggregates that support it, and `StringAgg` as a portable string aggregate. `AnyValue` returns an arbitrary non-null value. You will meet them when a report needs them. `GeneratedField` columns refresh after `save()` on backends that support `RETURNING` (SQLite, PostgreSQL, Oracle).

## Transactions

```python
from django.db import transaction

with transaction.atomic():
    task.save()
    log.save()
```

If `log.save()` raises, `task.save()` rolls back too. `atomic` is the boundary of consistency. Views are not wrapped in one giant transaction by default except inside `TestCase`, which wraps each test so it can roll the test back.

`select_for_update()` locks the selected rows inside a transaction so two requests cannot both pass a "is there stock left?" check. It needs a database that supports row locks (PostgreSQL does; SQLite's story is more limited).

:::watch
`annotate` plus `filter` on the annotation is legal. Filtering before or after the annotation changes the meaning of the count. Read the SQL when the number looks wrong: `str(queryset.query)`.
:::

:::quiz
Which helper follows a ForeignKey in the same SQL query?
+ select_related
- prefetch_related
- exists
because: select_related is a join. prefetch_related is a separate query, used when a join would multiply rows.
:::
