---
id: capstone
track: django
level: Advanced
module: Ship it
title: Capstone — design a production app
minutes: 20
keywords: architecture, service, fat model, boundary, checklist
summary: Put rules in the place that can enforce them. Walk a feature from URL to test to deploy before you call it done.
---

You now have the pieces. This lesson is how they fit when nobody is handing you the next file to edit.

## A shape that stays readable

| Layer | Holds | Does not hold |
| --- | --- | --- |
| URLconf | Names and converters | Business rules |
| View | HTTP: auth, status codes, which form, which template | Long calculations copied into every view |
| Form | Validation of input and the error messages | Hidden writes the caller cannot see |
| Model and queryset | Invariants, reusable queries, `clean` | Request objects |
| Template | Presentation | Queries and permission decisions |
| Task | Slow side effects | The only copy of a rule the request also needs |

A "fat model" becomes a junk drawer. A "service function" (`tasks/services.py` with `complete_task(task, by_user)`) is justified when a rule is used by a view, a command, and a task. One function, a transaction inside it, tests aimed at it. Do not create a service layer with one method per model that only calls `save`.

## Walkthrough: "mark my task done"

1. URL `tasks/<int:pk>/toggle/` named `task-toggle`, POST only.
2. View requires login, loads `Task` with `pk` and `owner=request.user`, 404 otherwise.
3. Flip `done` inside `atomic`, `save(update_fields=["done"])`.
4. Message and redirect to the list.
5. Template button is a form with `csrf_token`, not a link.
6. Tests: anonymous redirect, other user's id does not flip the row, owner toggles, GET is not allowed.
7. Admin can still edit `done` if operators should. That is a separate permission, not a hole in the view.

The lab implements a version of this. Read it after you try to sketch the files yourself.

## A definition of done

- Unauthorized users cannot see or change the row, and you have a test.
- Invalid input cannot write, and you have a test.
- The query count is sane (`assertNumQueries` or the toolbar).
- Migrations are committed.
- Secrets are not in the repository.
- `check --deploy` has been read.
- You can explain where the rule lives in one sentence.

## What this course did not turn into a novel

GeoDjango, the sites framework, flatpages, sitemaps, syndication, postgres-only fields, and the full admin templating system are real and documented. You can learn any one of them from the official reference now, because you can read a model, a view, a migration, and a test. The cheatsheet and the glossary are the index. The standard-library map is the same kind of index for Python.

When you are stuck, write the smallest command that fails: a test, a `manage.py shell` snippet, or a single view. The traceback is a location. The lesson on that layer is the explanation.

:::try
Sketch, on paper, the models, URLs, and tests for a notes app where each user has private notes with a title and a body. Then compare your list with the definition of done above. Build it only after the sketch has a test for "user B cannot read user A's note."
:::

:::solution
Model `Note` with `owner`, `title`, `body`, `created_at`. URLs: list, create, detail, update, delete, all login-required. Querysets filter on `request.user`. Forms expose `title` and `body` only. Tests cover the anonymous redirect, the cross-user 404, and a valid create that sets `owner` from the session. Admin is optional and staff-only.
:::

:::quiz
Where does "users only see their notes" live?
+ In the queryset the view uses, plus a test that would fail if the filter disappeared
- Only in the template, by hiding the link
- In the URLconf as a comment
because: The queryset is the enforcement. The template is a convenience. The test is what keeps the filter from being deleted later.
:::
