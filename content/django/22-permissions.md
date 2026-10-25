---
id: permissions
track: django
level: Intermediate
module: Views, auth, and requests
title: Permissions and groups
minutes: 14
keywords: permission, group, has_perm, PermissionRequiredMixin, staff
summary: Permissions are strings like tasks.change_task. Groups bundle them. Check permissions in the view, and filter the queryset too.
---

Django creates four permissions per model: `add`, `change`, `delete`, and `view`. The full name is `app_label.codename`, for example `tasks.change_task`.

```python
from django.contrib.auth.decorators import permission_required

@permission_required("tasks.change_task", raise_exception=True)
def toggle_task(request, pk):
    ...
```

`raise_exception=True` returns 403 instead of redirecting to login. Use it for users who are already authenticated and still not allowed. `PermissionRequiredMixin` is the class form.

`user.has_perm("tasks.change_task")` checks the user's permissions and the user's groups. Superusers return `True` for every check. `is_staff` only gates the admin site. It is not a permission on your models.

Object-level rules ("may edit this task, because they own it") are not what the default permissions do. The default is model-wide. Ownership is a queryset filter:

```python
task = get_object_or_404(Task, pk=pk, owner=request.user)
```

A permission check without that filter lets a staff editor open every row. A filter without a permission check is the right model for "users only see their own tasks." Use both when operators and owners share a view.

Custom permissions live in `Meta`:

```python
class Meta:
    permissions = [("publish_task", "Can publish task")]
```

Make a migration after adding them. Assign them in the admin via groups. A group named `editors` is easier to audit than a hundred individual grants.

:::watch
Hiding a button in the template is not authorization. The view must check. Anyone can POST the URL the button would have used.
:::

:::quiz
What does tasks.view_task mean?
+ Permission to view Task objects, model-wide, not "view this one row"
- The user is a superuser
- The user owns the task
because: Built-in permissions are per model. Row ownership is your filter.
:::
