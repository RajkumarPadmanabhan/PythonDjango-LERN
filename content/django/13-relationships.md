---
id: relationships
track: django
level: Intermediate
module: Models and the database
title: Relationships
minutes: 16
keywords: ForeignKey, OneToOneField, ManyToManyField, related_name, on_delete
summary: ForeignKey is many-to-one. OneToOneField is a single pair. ManyToManyField is a table of pairs Django maintains for you.
---

A task has one owner. An owner has many tasks. That is a foreign key on the "many" side.

```python
owner = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,
    related_name="tasks",
)
```

`task.owner` is the user. `user.tasks.all()` is the reverse queryset, named by `related_name`. Without `related_name`, Django uses `task_set`. Name it. Always point foreign keys at `settings.AUTH_USER_MODEL`, not at `User`, so a custom user model can replace the default.

`OneToOneField` is a foreign key with a unique constraint. A profile row that extends a user is the classic case. Access is `user.profile`, and a missing profile raises `RelatedObjectDoesNotExist`.

`ManyToManyField` creates a join table. Tags on a task:

```python
tags = models.ManyToManyField("Tag", related_name="tasks", blank=True)
task.tags.add(tag)
task.tags.all()
```

If the join needs its own fields (who added the tag, and when), declare an explicit through model. A many-to-many is not free: `.all()` is another query unless you prefetch.

## on_delete, again, with data

`CASCADE` on `owner` deletes a user's tasks when the user is deleted. That may be what you want. `PROTECT` forces you to reassign or delete the tasks first, which is what you want for an invoice and its customer. Write the sentence down before you pick the option.

Referential integrity is a database guarantee. Two requests cannot create a task whose `owner_id` does not exist. Checking `User.objects.filter(pk=value).exists()` and then inserting is not the same guarantee.

:::why
The column stored on `tasks` is `owner_id`. The ORM turns `task.owner` into a query for that user if the user object is not cached on the instance. Looping tasks and reading `task.owner.name` without `select_related("owner")` is one query per task. The queryset lesson shows the fix.
:::

:::quiz
Where do you put a ForeignKey for "many tasks belong to one user"?
+ On the Task model
- On the User model as a list
- In the template
because: The many side holds the foreign key column. The user side sees a reverse manager named by related_name.
:::
