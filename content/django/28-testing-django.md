---
id: testing-django
track: django
level: Intermediate
module: Views, auth, and requests
title: Testing Django
minutes: 16
keywords: TestCase, Client, force_login, assertTemplateUsed, LiveServer
summary: Django's TestCase rolls back the database and gives you a client that does not need a running server. Test views through HTTP and models through behavior.
---

```python
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from .models import Task

class TaskListTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user("ada", password="long-passphrase")
        Task.objects.create(title="Write", owner=self.user)

    def test_requires_login(self):
        response = self.client.get(reverse("task-list"))
        self.assertEqual(response.status_code, 302)

    def test_shows_own_task(self):
        self.client.force_login(self.user)
        response = self.client.get(reverse("task-list"))
        self.assertContains(response, "Write")
```

Run `python manage.py test`. Django creates a test database, runs migrations, and wraps each `TestCase` method in a transaction that rolls back. Tests do not see each other's rows. `SimpleTestCase` does not allow database queries. Use it for pure functions. `TransactionTestCase` truncates tables instead of rolling back, which you need only when the code under test depends on transaction commit behavior.

`self.client` is a dummy browser. `follow=True` follows redirects. `force_login` skips the password. Use a real `client.login` when you are testing the login form itself.

`assertContains` checks status 200 and the body. `assertRedirects` checks the target. `assertFormError` checks a field error. `assertQuerySetEqual` compares querysets. `assertNumQueries` fails when a view grows an N+1.

## What to cover on a feature

- Anonymous user is rejected.
- A user cannot see or change another user's row (404 or 403, and the row is unchanged).
- Invalid form input does not write.
- Valid input writes what you claim, including fields the client did not send, such as `owner`.

`RequestFactory` calls the view function without middleware. Prefer `Client` so auth and CSRF run. `Client` disables CSRF checks by default in tests. `Client(enforce_csrf_checks=True)` turns them on when that is the bug you are hunting.

:::tip
Factory helpers (`TaskFactory` in a small function, or factory_boy if the graph gets deep) keep `setUp` readable. A test that builds twenty objects inline hides the one field that matters.
:::

:::quiz
Why is the test database safe to roll back?
+ Each TestCase runs in a transaction that Django aborts after the test
- Tests write to production and Django restores a backup
- SQLite cannot store test rows
because: The rollback is the isolation. It is also why code that commits for real needs TransactionTestCase to be observed.
:::
