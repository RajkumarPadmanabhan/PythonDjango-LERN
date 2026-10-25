---
id: lab-taskboard
track: lab
level: Intermediate
module: Practice projects
title: Lab — task board
minutes: 40
keywords: lab, model, form, login, test, CSRF
summary: Run the Django task board in labs/taskboard. It is the course's working example of auth, models, forms, templates, and tests.
---

The project is already written. Your job is to run it, read it, and then change it.

## Run

```powershell
cd labs\taskboard
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Open `http://127.0.0.1:8000/`. You are redirected to login. Create a user in the admin at `/admin/` if you did not use `createsuperuser`, or register no public sign-up — this lab creates users in the admin on purpose, so you see that public registration is a separate feature.

Add a task. Mark it done. Log out. The logout button is a POST form.

```powershell
python manage.py test
```

The tests should pass. They cover login, isolation between users, and toggling.

## Read in this order

1. `config/settings.py` — installed apps, database, login redirects.
2. `config/urls.py` — admin, auth, tasks.
3. `tasks/models.py` — the `Task` model.
4. `tasks/forms.py` — fields the user may set.
5. `tasks/views.py` — login, owner filter, Post/Redirect/Get.
6. `tasks/urls.py` — names.
7. `tasks/templates/tasks/base.html` and `task_list.html` — inheritance, CSRF, empty state.
8. `tasks/admin.py` — staff view of the same model.
9. `tasks/tests.py` — the two promises the views make.
10. `tasks/migrations/0001_initial.py` — the schema as an operation list.

## Things to change, in order

1. Add a `priority` field with `TextChoices` of low and high. Make the migration. Show it in the template and the admin.
2. Stop the empty-title case in the form, even though `CharField` already requires a value. Strip whitespace and reject a title of spaces.
3. Read `test_cannot_toggle_someone_elses_task`, then add the same promise for delete: user A posting to user B's delete URL gets a 404 and the row remains.
4. Add `paginate_by` once you have more than a page of tasks. A function-based paginator is the lesson's `Paginator`.

Do not skip the test in step 3. That test is the difference between a demo and a program that keeps a promise.

:::watch
If `migrate` says the table already exists, you are pointing at a database that was created by hand. Delete `db.sqlite3` in development only, then migrate again. Do not delete a database you do not recognize.
:::

:::quiz
Why does the lab filter tasks by request.user?
+ So one account cannot read or change another account's rows
- Because SQLite requires an owner column
- Because the admin would be empty otherwise
because: Login proves who you are. The queryset decides what you may touch.
:::
