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

The template includes `{% csrf_token %}` inside the `<form method="post">`.

## Queries

```py
Task.objects.filter(owner=request.user, done=False).order_by("-created_at")
Task.objects.select_related("owner")
Book.objects.prefetch_related("tags")
Task.objects.filter(title__icontains=query)
```

`select_related` follows a foreign key in the same query. `prefetch_related` is for many rows on the other side. Filter before you slice or paginate.

## One increment

```py
from django.db.models import F

choice.votes = F("votes") + 1
choice.save(update_fields=["votes"])
```

## Two writes that must agree

```py
from django.db import transaction

with transaction.atomic():
    team = Team.objects.create(name=name)
    Membership.objects.create(team=team, user=request.user, role="owner")
```

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

`{{ name }}` escapes HTML. Do not mark user text `|safe`.

## Test

```py
self.client.force_login(other)
response = self.client.post(reverse("task-toggle", args=[task.pk]))
self.assertEqual(response.status_code, 404)
task.refresh_from_db()
self.assertFalse(task.done)
```

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
