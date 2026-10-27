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

:::how
`@login_required` sends an anonymous visitor to the login page before the function runs, so `request.user` inside the function is a real user. `filter(owner=request.user)` adds `WHERE owner_id = ...` to the query. Rows for other people are never loaded. `render` passes only that queryset into the template. A `{% if %}` in the template cannot do this job, because the other rows would already have been fetched.
:::

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

:::how
`@require_POST` rejects GET, so a link or a refresh cannot toggle. `get_object_or_404` builds one query with both the primary key and the owner. If either part fails to match, Django raises 404 and the following lines never run. `not task.done` flips the boolean in Python. `update_fields=["done"]` writes that column only, so a stale copy of another field is not saved over a newer value. `redirect` answers with GET on the list page, which is safe to refresh.
:::
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

:::how
GET takes the `else` branch and shows an empty form. POST builds the form from `request.POST`. `is_valid()` runs the field rules and stops the write when they fail. `commit=False` builds a `Task` in memory and does not `INSERT` yet, which is the gap where `owner` is set from `request.user` rather than from the browser. The real `save()` writes the row. `redirect` leaves the POST behind. An invalid form skips the inner `if` and falls through to `render`, so the same page shows the errors.
:::

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

:::how
`choice.votes = choice.votes + 1` reads a number into Python and later writes that number back. Two requests can both read 3 and both write 4. `F("votes") + 1` is not a number. It is an instruction the database executes as `votes = votes + 1` inside the `UPDATE`, so each request adds one to whatever is stored at that moment. After `save`, the attribute on the Python object is still that instruction, not the new integer. `refresh_from_db()` runs a `SELECT` and replaces it with the stored number before you display it.
:::

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

:::how
The task is created owned by `self.user`, then the client is logged in as `other`. `force_login` skips the login form because this test is about authorization, not about passwords. `post` hits the toggle URL with that task's primary key. The view's owner lookup fails, so the status is 404. `refresh_from_db` reloads the row from the database. `assertFalse(task.done)` checks the stored value, not the object still sitting in memory from `create`. Both asserts are required: a 404 that still flipped `done` would pass a status-only test.
:::

Assert the status and the row. A 404 that still flipped `done` would be a passing test if you only checked the status.
:::

:::quiz
Why is owner both in the filter and absent from the form?
+ The logged-in user is the source of truth. A posted owner field can be forged.
- Django forms cannot include foreign keys
- Templates are not allowed to show the owner
because: Anything the browser sends can be changed. The view copies `request.user` onto the row after the form is valid.
:::
