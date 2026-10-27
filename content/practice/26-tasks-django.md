---
id: tasks-django
track: practice
level: Pro
module: Tasks
title: Tasks — Django decisions
minutes: 30
keywords: task, django, owner, form, test, F
summary: Five server-side decisions. Write the view or the test, then compare it with the solution.
---

These run in a Django project, not in the browser Run button. Use the task board in `labs/taskboard` or a fresh app. The snippets assume a `Task` model with `title`, `done`, and `owner`.

## Task 1 — only my rows

The list view must not leak another user's tasks.

:::solution
```py
@login_required
def task_list(request):
    tasks = Task.objects.filter(owner=request.user)
    return render(request, "tasks/list.html", {"tasks": tasks})
```

Filtering in the template is too late. The query is the decision.
:::

## Task 2 — toggle only my task

POST only. Another user's id is a 404. Update the `done` column only.

:::solution
```py
@login_required
@require_POST
def toggle(request, pk):
    task = get_object_or_404(Task, pk=pk, owner=request.user)
    task.done = not task.done
    task.save(update_fields=["done"])
    return redirect("task-list")
```
:::

## Task 3 — the server sets the owner

The form has `title` and `detail`. It does not have `owner`.

:::solution
```py
@login_required
def create_task(request):
    if request.method == "POST":
        form = TaskForm(request.POST)
        if form.is_valid():
            task = form.save(commit=False)
            task.owner = request.user
            task.save()
            return redirect("task-list")
    else:
        form = TaskForm()
    return render(request, "tasks/form.html", {"form": form})
```

`commit=False` gives you a model instance without writing the row, so you can set `owner` before the real `save`. A successful POST redirects. An invalid POST falls through and shows the form with errors.
:::

## Task 4 — one vote is one increment

Two requests must not lose an increment.

:::solution
```py
from django.db.models import F

choice.votes = F("votes") + 1
choice.save(update_fields=["votes"])
choice.refresh_from_db()
```

After `save`, `choice.votes` is still an `F` expression until you reload the row. Read it back with `refresh_from_db` before you display the number in Python.
:::

## Task 5 — a test that the other user loses

Write the test before you trust the view.

:::solution
```py
def test_cannot_toggle_someone_elses_task(self):
    other = User.objects.create_user("other", password="secret-pass-123")
    task = Task.objects.create(title="Mine", owner=self.user, done=False)
    self.client.force_login(other)
    response = self.client.post(reverse("task-toggle", args=[task.pk]))
    self.assertEqual(response.status_code, 404)
    task.refresh_from_db()
    self.assertFalse(task.done)
```

Assert the status and the row. A 404 that still flipped `done` would be a passing test if you only checked the status.
:::

:::quiz
Why is owner both in the filter and absent from the form?
+ The logged-in user is the source of truth. A posted owner field can be forged.
- Django forms cannot include foreign keys
- Templates are not allowed to show the owner
because: Anything the browser sends can be changed. The view copies `request.user` onto the row after the form is valid.
:::
