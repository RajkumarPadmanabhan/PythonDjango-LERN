---
id: models
track: django
level: Beginner
module: Models and the database
title: Models
minutes: 18
keywords: Model, Field, Meta, Manager, __str__, pk
summary: A model class declares a table. Each instance is a row. The manager on the class is how you query.
---

```python
from django.conf import settings
from django.db import models

class Task(models.Model):
    title = models.CharField(max_length=200)
    detail = models.TextField(blank=True)
    done = models.BooleanField(default=False)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="tasks",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["done", "-created_at"]

    def __str__(self):
        return self.title
```

`CharField` becomes a `varchar`. `TextField` becomes unlimited text. `blank=True` means forms may leave it empty. `null=True` means the database may store NULL. For text fields, prefer `blank=True` and store `""` rather than NULL, so you do not have two empty values. For numbers, dates, and foreign keys, `null=True` is the way to say "unknown."

`auto_now_add` sets the time on insert. `auto_now` updates it on every save. Both are convenient and bypass your ability to pass the timestamp in. For a value the user edits, use `default=timezone.now` without the parentheses so the function is called per insert, not at import.

`class Meta` holds options that are not fields: `ordering`, `indexes`, `constraints`, `verbose_name`, `unique_together` (prefer `constraints` on new code), `db_table`.

`__str__` is what the admin and the shell show. Write one for every model.

## Managers

`Task.objects` is a manager. `Task.objects.all()` is a queryset. `Task.objects.create(title="Write", owner=user)` inserts a row and returns the instance. Creating an instance and calling `save` does the same:

```python
task = Task(title="Write", owner=user)
task.save()
```

`pk` is the primary key, whatever field it is. Django 6 defaults `DEFAULT_AUTO_FIELD` to `BigAutoField`, a 64-bit id. You do not have to declare the id yourself.

A model is not the form, and it is not the HTTP layer. Validation that is always true ("title cannot be empty") belongs on the model or the field. Validation that depends on the request ("this user may edit") belongs in the view or a form. The next lessons cover fields, migrations, and queries.

:::watch
`default=[]` on a JSONField or any mutable default is shared state if you pass the list object. Django's `JSONField` wants `default=dict` or `default=list`, the callable, not `default={}`. The callable is called per insert.
:::

:::quiz
What is the difference between blank=True and null=True?
+ blank affects form validation. null affects whether the database stores NULL
- They are aliases
- null only works on CharField
because: A form can reject an empty value that the database would have accepted, and the reverse. Set each one for its own layer.
:::
