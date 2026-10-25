---
id: managers-transactions
track: django
level: Advanced
module: Advanced Django
title: Managers, custom querysets, and transactions
minutes: 16
keywords: Manager, QuerySet, as_manager, atomic, select_for_update, constraint
summary: Put reusable queries on a queryset. Put transaction boundaries around states that must change together.
---

```python
class TaskQuerySet(models.QuerySet):
    def open(self):
        return self.filter(done=False)

    def for_owner(self, user):
        return self.filter(owner=user)

class Task(models.Model):
    objects = TaskQuerySet.as_manager()
```

`Task.objects.for_owner(user).open()` reads in the order you write it, and each method returns a queryset so the chain continues. A manager method that returns a queryset should usually live on the queryset so it is chainable. `as_manager()` copies queryset methods onto the manager.

Do not filter "not deleted" in every view if the project uses soft delete. Put `deleted_at__isnull=True` on a queryset method and make that the default manager only if you are sure the admin and migrations should see the same filter. A second manager, `all_objects`, is how you reach hidden rows.

## Transactions

A transfer, an inventory decrement, and "save the task and its first comment" are transactions. `transaction.atomic()` is the block. Nested `atomic` blocks become savepoints.

`transaction.on_commit(send_email)` runs the function after the surrounding transaction commits. Sending email inside `atomic`, before commit, can notify a user about a row that then rolls back. `on_commit` is the fix. In tests, `TestCase` wraps the test in a transaction that never commits, so `on_commit` callbacks do not run unless you use `TestCase.captureOnCommitCallbacks` or `TransactionTestCase`.

```python
with transaction.atomic():
    locked = Task.objects.select_for_update().get(pk=pk, owner=user)
    locked.done = True
    locked.save(update_fields=["done"])
```

`select_for_update` holds a row lock until the transaction ends. Keep the block short. Do not call an external API while holding the lock.

## Constraints as the last line

Two requests can both pass an `exists()` check and both insert. A `UniqueConstraint` makes the second insert fail with `IntegrityError`. Catch it and turn it into a form error if the race is part of normal use. The database is the authority. The view check is a nicer error message for the common case.

Django 6 raises `Model.NotUpdated` when a forced update matches no row, instead of a generic database error. Catch the specific exception.

:::quiz
Why send email in on_commit rather than inside atomic before the block ends?
+ The email would lie if the transaction rolls back
- on_commit is faster
- SMTP only works after commit flags
because: Side effects that are not database writes should happen only if the database change sticks.
:::
