---
id: orm-queries
track: django
level: Beginner
module: Models and the database
title: ORM queries
minutes: 20
keywords: QuerySet, filter, exclude, get, lazy, SQL
summary: A queryset describes a query. It does not hit the database until you evaluate it. Chaining filters adds AND conditions.
---

```python
open_tasks = Task.objects.filter(done=False, owner=user).order_by("-created_at")
for task in open_tasks:
    print(task.title)
```

`filter` returns a new queryset. Nothing is queried yet. The SQL runs when you iterate, slice in a way that needs rows, call `list`, `len`, `bool`, `exists`, `count`, `get`, `first`, or `aggregate`. Printing a queryset in the shell often evaluates it, which is why the shell feels eager.

Lookups use a double underscore:

```python
Task.objects.filter(title__icontains="report")
Task.objects.filter(created_at__year=2026)
Task.objects.exclude(done=True)
Task.objects.filter(owner__username="ada")
```

`icontains` is case-insensitive. Spanning `owner__username` joins the user table. The cheatsheet lists the lookup catalog.

## get, first, exists, count

```python
task = Task.objects.get(pk=5)          # one row, or DoesNotExist, or MultipleObjectsReturned
task = Task.objects.filter(pk=5).first()  # one row or None
yes = Task.objects.filter(owner=user).exists()
n = Task.objects.filter(owner=user).count()
```

`len(queryset)` fetches the rows. `count()` asks the database for a number. Use `exists` when you do not need the objects. In a template, `if queryset` evaluates the queryset and can run a query. Prefer to decide in the view.

## Slices

```python
Task.objects.order_by("-created_at")[:20]
```

A slice becomes `LIMIT`. Do not index with a negative number. Pagination is the user-facing version of this.

## Evaluation and reuse

```python
qs = Task.objects.filter(owner=user)
list(qs)  # query
list(qs)  # the same queryset object queries again unless the results are cached
```

A queryset caches after a full evaluation. A sliced one is more subtle. When you pass a queryset into a template and the template loops once, you pay once. When a view loops and a template loops, cache it with `tasks = list(qs)` if both need the same rows.

`update` and `delete` on a queryset run SQL without calling `save` or `delete` on each instance. Signals and custom `save` methods do not run. Use them for bulk work when that is what you want.

```python
Task.objects.filter(pk__in=ids, owner=user).update(done=True)
```

:::why
Querysets are lazy so you can build them in pieces. A view can start with `Task.objects.filter(owner=request.user)` and a later function can add `.filter(done=False)` without a query in between. The cost shows up at evaluation. Django Debug Toolbar, or `connection.queries` when `DEBUG` is True, shows the SQL.
:::

:::watch
`Task.objects.get(done=False)` raises `MultipleObjectsReturned` as soon as a second open task exists. `get` means one. Use `filter` for a collection.
:::

:::quiz
When does filter() talk to the database?
+ When the queryset is evaluated, not when filter is called
- Immediately, on the filter call
- Only if you print the SQL yourself
because: filter returns a new unevaluated queryset. Iteration, get, count, exists, and similar operations evaluate it.
:::
