---
id: migrations
track: django
level: Beginner
module: Models and the database
title: Migrations
minutes: 16
keywords: makemigrations, migrate, migration, schema, squash
summary: Migrations are ordered Python files that change the database schema. Django makes them by comparing models to the last migration.
---

```powershell
python manage.py makemigrations
python manage.py migrate
python manage.py showmigrations
```

`makemigrations` reads your models and writes a file in `migrations/`. `migrate` applies files that have not been recorded in the `django_migrations` table. You commit the migration files. You do not commit the database.

A migration contains operations: `CreateModel`, `AddField`, `AlterField`, `RemoveField`, `RunPython`, `AddIndex`, `AddConstraint`. They run in order. Each file names its dependencies.

## The hidden state

Django does not diff against the live database to decide what `makemigrations` should write. It diffs your models against the **migration history**. If you edit a model and also edit an old migration by hand, the next `makemigrations` gets confused. If you change a column in a database shell and not in a migration, Django does not know.

When a migration is wrong and has never been applied anywhere else, delete it and recreate it. When it has been applied on another machine or in production, write a new migration that moves forward. Do not rewrite history that others have applied.

## Data migrations

`RunPython` runs Python against the historical models. Use those models, not `tasks.models.Task`, because today's model may have fields the old database does not.

```python
def fill_priority(apps, schema_editor):
    Task = apps.get_model("tasks", "Task")
    Task.objects.filter(priority="").update(priority="low")

class Migration(migrations.Migration):
    operations = [
        migrations.RunPython(fill_priority, migrations.RunPython.noop),
    ]
```

Provide a reverse function or `noop`. A data migration that cannot be reversed should say so.

## Squashing and conflicts

Two branches that both add migration `0003` conflict. Rename one to depend on the other, or merge them. `squashmigrations` collapses a long early history into one file. Django 6 lets you squash a squash. Do this for tidiness, not as a way to edit production history casually.

`sqlmigrate tasks 0001` prints the SQL without applying it. Read it when the change is dangerous (a column type change on a large table can lock it).

:::watch
Adding a non-null field without a default to a table that already has rows fails, because existing rows would violate the constraint. Add the field as null, backfill, then alter it to non-null. Or provide a one-off default.
:::

:::quiz
What does makemigrations compare your models to?
+ The migration files, not the live database
- Whatever columns happen to exist in SQLite
- The admin registry
because: Migration history is the source of schema truth. The database is a result of applying that history.
:::
