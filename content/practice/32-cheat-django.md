---
id: cheat-django
track: practice
level: Reference
module: Cheat codes
title: Cheat codes — Django
minutes: 22
keywords: cheat, django, view, queryset, form, test
summary: The view, query, form, template, and test shapes you reach for. The Django cheatsheet in Reference is the catalog of names.
---

These are the shapes. Names of every lookup and template tag live in the Django cheatsheet.

## URL

```py
path("tasks/<int:pk>/toggle/", views.toggle, name="task-toggle"),
```

Reverse the name. Do not paste the path in a template or a test.

```django
<a href="{% url 'task-toggle' task.pk %}">Toggle</a>
```

```py
reverse("task-toggle", args=[task.pk])
```

:::how
`path` registers the pattern and the name. `<int:pk>` only matches digits and passes `pk` as an int. The template `{% url %}` and the Python `reverse` both look up that name, so the real path lives in one place. `args` fills the `<int:pk>` converter in order. If you paste `/tasks/3/toggle/` in three files, a renamed URL breaks two of them.
:::

## A page that changes data

```py
@login_required
@require_POST
def toggle(request, pk):
    task = get_object_or_404(Task, pk=pk, owner=request.user)
    task.done = not task.done
    task.save(update_fields=["done"])
    return redirect("task-list")
```

:::how
`@login_required` runs before the function and redirects anonymous users. `@require_POST` rejects GET, so a link cannot change data. The lookup includes `owner=request.user`, so another person's primary key is a 404 and the later lines do not run. `not task.done` flips the boolean. `update_fields` writes that column only. `redirect` responds with GET on the named URL.
:::

GET reads. POST changes. The owner is part of the lookup.

## A form that creates

```py
if request.method == "POST":
    form = TaskForm(request.POST)
    if form.is_valid():
        task = form.save(commit=False)
        task.owner = request.user
        task.save()
        return redirect("task-list")
else:
    form = TaskForm()
```

:::how
A GET request takes the `else` and shows an empty form. A POST builds the form from the submitted data. `is_valid()` runs the field checks. `commit=False` returns an unsaved model so `owner` can be set from `request.user` before `save()` writes the row. The redirect runs only after that save. Invalid data skips the inner block and, in a full view, falls through to render the same form with errors. `{% csrf_token %}` is the token Django checks on POST. Without it the request is rejected with 403.
:::

The template includes `{% csrf_token %}` inside the `<form method="post">`.

## Queries

```py
Task.objects.filter(owner=request.user, done=False).order_by("-created_at")
Task.objects.select_related("owner")
Book.objects.prefetch_related("tags")
Task.objects.filter(title__icontains=query)
```

:::how
`filter` adds conditions. Two arguments are combined with AND. `order_by("-created_at")` sorts newest first because the minus sign reverses that field. `select_related("owner")` joins the owner row into the same query, which you want for a foreign key you will display. `prefetch_related("tags")` is a second query for a many-side relation, then Python attaches the rows. `__icontains` becomes a case-insensitive `LIKE`. Filter before you slice, or the database limits the wrong set.
:::

`select_related` follows a foreign key in the same query. `prefetch_related` is for many rows on the other side. Filter before you slice or paginate.

## One increment

```py
from django.db.models import F

choice.votes = F("votes") + 1
choice.save(update_fields=["votes"])
```

:::how
`F("votes") + 1` is an instruction, not a Python number. The `UPDATE` tells the database to add one to the value it has stored. Two clicks cannot both read 3 and both write 4. After `save`, the Python attribute is still the `F` object. Reload with `refresh_from_db()` before you read the number in Python.
:::

## Two writes that must agree

```py
from django.db import transaction

with transaction.atomic():
    team = Team.objects.create(name=name)
    Membership.objects.create(team=team, user=request.user, role="owner")
```

:::how
`atomic` starts a transaction. If the membership line raises, the team insert is rolled back too, so you never keep a team with no owner. Code after the block runs only when both writes committed. Mail goes in `transaction.on_commit`, because mail sent inside the block can go out and then the transaction can still roll back.
:::

Send mail after commit with `transaction.on_commit(send)`, not inside the block.

## Template

```django
{% if tasks %}
  <ul>
  {% for task in tasks %}
    <li>{{ task.title }}</li>
  {% endfor %}
  </ul>
{% else %}
  <p>No tasks yet.</p>
{% endif %}
```

:::how
`{% if tasks %}` is false for an empty queryset, so the empty message is the other branch. `{% for %}` walks the queryset. `{{ task.title }}` inserts the text and escapes `<` so a title cannot become HTML. `|safe` turns that protection off. Use it only for markup you generated yourself.
:::

`{{ name }}` escapes HTML. Do not mark user text `|safe`.

## Test

```py
self.client.force_login(other)
response = self.client.post(reverse("task-toggle", args=[task.pk]))
self.assertEqual(response.status_code, 404)
task.refresh_from_db()
self.assertFalse(task.done)
```

:::how
`force_login` puts `other` in the session without going through the login form. `reverse` builds the URL from the name. `post` is the request. The status assert checks the response. `refresh_from_db` reloads the row, because the `task` object in the test still has the old `done` until you ask the database again. The second assert is what proves the toggle did not happen.
:::

Log in with `force_login` unless the test is about the login form. Assert the row, not only the status code.

## The mistakes the shapes exist to prevent

| Mistake | Shape that prevents it |
| --- | --- |
| Hidden owner field | `task.owner = request.user` |
| Delete or toggle on GET | `@require_POST` |
| Another user's row | `owner=request.user` in the same lookup |
| Refresh resubmits the form | `redirect` after a valid POST |
| Lost vote | `F("votes") + 1` |
| HTML built with an f-string | a template |
| Path typed in three places | `name=` and `{% url %}` |

:::tip
`python manage.py check --deploy` is the cheat code for production settings. Read every warning. The deployment lesson explains the ones that matter.
:::
