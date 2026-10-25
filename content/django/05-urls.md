---
id: urls
track: django
level: Beginner
module: Foundations
title: URL routing
minutes: 16
keywords: path, include, re_path, converter, name, reverse
summary: A URL pattern maps a path to a view and gives that mapping a name. Reverse names in templates and redirects. Do not hard-code paths.
---

```python
from django.urls import include, path
from tasks import views

urlpatterns = [
    path("", views.task_list, name="task-list"),
    path("tasks/<int:pk>/toggle/", views.toggle_task, name="task-toggle"),
    path("accounts/", include("django.contrib.auth.urls")),
]
```

`path` matches a route. Text is literal. `<int:pk>` captures an integer and passes it as the keyword argument `pk`. The view must accept `pk`. Other converters: `str` (default, excludes `/`), `slug`, `uuid`, `path` (includes `/`).

`include` mounts another URL conf. The project `config/urls.py` includes the app:

```python
path("", include("tasks.urls")),
```

## Names and reverse

```python
from django.urls import reverse
reverse("task-toggle", kwargs={"pk": 4})
```

In a template: `{% url 'task-toggle' task.pk %}`. If you move the path from `/tasks/` to `/work/`, the name still resolves. A hard-coded `/tasks/4/toggle/` does not.

Names live in a single namespace unless you add `app_name = "tasks"` and include the URLs with a namespace. Then the name is `tasks:task-list`. Do this as soon as two apps might both define `detail`.

## What the resolver does

Django walks `urlpatterns` in order and uses the first match. Put specific routes before general ones. `path("tasks/new/", ...)` must appear before `path("tasks/<slug:title>/", ...)` if `new` would otherwise be captured as a title.

`re_path(r"^legacy/(?P<year>[0-9]{4})/$", view)` is the escape hatch for a real regular expression. Prefer converters. A regex in a URL is a small denial-of-service risk if it is open to backtracking, and it is harder to read.

`APPEND_SLASH` defaults to True. A request for `/tasks` can redirect to `/tasks/` if that pattern exists. POST bodies are not always preserved across that redirect. Write the slash you meant in the form action, by using `{% url %}` rather than a hand-typed path.

:::why
The captured value is a Python object, not just text. `<int:pk>` is already an `int`. You do not need `int(pk)` in the view. If the text is not an integer, this pattern does not match and Django tries the next one, or returns 404.
:::

:::try
Design names, not paths, for three pages: a list, a detail that takes an integer id, and a create page. Say which pattern must not be last.
:::

:::solution
`task-list` at `""` or `"tasks/"`. `task-create` at `"tasks/new/"`. `task-detail` at `"tasks/<int:pk>/"`. The literal `tasks/new/` must be registered before a pattern that would capture `new` as a slug or string.
:::

:::quiz
Why reverse a URL name instead of writing /tasks/4/?
+ Renaming the path then updates every redirect and template that uses the name
- Names are faster for the browser
- Django rejects hard-coded paths at startup
because: The name is stable. The path is an implementation detail the resolver can recompute.
:::
